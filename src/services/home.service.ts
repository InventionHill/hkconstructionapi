import { Request } from "express";
import { Op, Sequelize } from "sequelize";
import BannersData from "../model/banner.model";
import { ActiveStatus, DeletedStaus, IMAGE_TYPE } from "../utils/app-enumeration";
import { DEFAULT_STATUS_CODE_SUCCESS, FILE_SIZE_5MB, FILE_SIZE_8MB, RECORD_DELETE_SUCCESSFULLY, RECORD_UPDATE_SUCCESSFULLY } from "../utils/app-messages";
import { getInitialPaginationFromQuery, getLocalDate, resErrorDataExit, resNotFound, resSuccess, columnValueLowerCase, resBadRequest } from "../utils/shared-functions";
import { moveFileToFps } from "../helpers/file.helper";
import Image from "../model/image.model";
import dbContext from "../config/db-context";
import ProjectData from "../model/projects.model";
import ContactUs from "../model/contactUs.model";
import FeedbackData from "../model/feedback.model";
import ProjectImages from "../model/project-image.model";
import ClintSayData from "../model/clientSay.Model";
import { log } from "handlebars";
import GroupOfCompanyData from "../model/group-of-company.model";
import SolarPanelData from "../model/solarPanel.model";

////////////////////// Banner //////////////////////
export const dashboard = async (req: Request) => {
  try {
    var projects = await ProjectData.count({ where: { is_deleted: DeletedStaus.InDeleted } });
    var contactUs = await ContactUs.count({ where: { is_deleted: DeletedStaus.InDeleted } });
    return resSuccess({ data: { projects, enquiry: contactUs } });
  } catch (error) {
    throw error;
  }
}

////////////////////// Banner //////////////////////

export const addBanner = async (req: Request) => {
  const { title, paragraph, button, button_link, button_text, is_video } = req.body

  const trn = await dbContext.transaction();
  try {
    let idImage = null
    if (req.file) {
      if (req.file.size > 8000000) {
        return resBadRequest({ message: FILE_SIZE_8MB })
      }
      const moveFileResult = await moveFileToFps(
        req.file
      );

      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.Banner,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;
    }

    const payload = {
      title: title,
      paragraph: paragraph,
      button: button,
      button_link: button_link,
      button_text: button_text,
      created_date: getLocalDate(),
      is_deleted: DeletedStaus.InDeleted,
      created_by: req.body.session_res.id_app_user,
      status: ActiveStatus.Active,
      id_image: idImage,
      is_video: is_video
    }

    await BannersData.create(payload, { transaction: trn })
    await trn.commit()
    return resSuccess({ data: payload });
  } catch (error) {
    await trn.rollback()
    throw (error)
  }
}
export const getAllBanner = async (req: Request) => {
  try {
    let paginationProps = {};

    let pagination = {
      ...getInitialPaginationFromQuery(req.query),
      search_text: req.query.search_text,
    };
    let noPagination = req.query.no_pagination === "1";

    let where = [
      { is_deleted: DeletedStaus.InDeleted },
      pagination.is_active ? { status: pagination.is_active } : {},
      pagination.search_text
        ? {
          [Op.or]: [
            { title: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { paragraph: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { button_text: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { button_link: { [Op.iLike]: "%" + pagination.search_text + "%" } },

          ],
        }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await BannersData.count({
        where,
      });

      if (totalItems === 0) {
        return resSuccess({ data: { pagination, result: [] } });
      }
      pagination.total_items = totalItems;
      pagination.total_pages = Math.ceil(totalItems / pagination.per_page_rows);

      paginationProps = {
        limit: pagination.per_page_rows,
        offset: (pagination.current_page - 1) * pagination.per_page_rows,
      };
    }

    const result = await BannersData.findAll({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "title",
        "paragraph",
        "button",
        "button_link",
        "button_text",
        "created_date",
        "modified_date",
        "is_deleted",
        "is_video",
        "created_by",
        "modified_by",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
      ],
    });

    return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
}
export const getBanner = async (req: Request) => {
  try {

    let where = [
      { status: ActiveStatus.Active },
      { is_deleted: DeletedStaus.InDeleted }
    ];


    const result = await BannersData.findAll({
      where,
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "title",
        "is_video",
        "paragraph",
        "button",
        "button_link",
        "button_text",
        "created_date",
        [Sequelize.literal("image.image_path"), "image_path"],
      ],
    });

    return resSuccess({ data: result });
  } catch (error) {
    throw error;
  }
}
export const getByIdBanner = async (req: Request) => {
  try {
    console.log(req.params.id);
    const banner = await BannersData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(banner && banner.dataValues)) {
      return resNotFound();
    }
    return resSuccess({ data: banner })
  } catch (error) {
    throw error
  }
}
export const updateBanner = async (req: Request) => {
  const { id, title, paragraph, button, button_link, button_text, is_video } = req.body
  const trn = await dbContext.transaction();

  try {
    let idImage = null
    console.log(req.file, "checl");

    if (req.file) {
      if (req.file.size > 8000000) {
        return resBadRequest({ message: FILE_SIZE_8MB })
      }
      const moveFileResult = await moveFileToFps(
        req.file
      );
      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.Banner,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;

    }

    const bannerId = await BannersData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

    if (bannerId) {
      let bannerInfo;
      if (idImage) {

        bannerInfo = await (BannersData.update(
          {
            title: title,
            paragraph: paragraph,
            button: button,
            button_link: button_link,
            button_text: button_text,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
            id_image: idImage,
            is_video: is_video
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      } else {
        bannerInfo = await (BannersData.update(
          {
            title: title,
            paragraph: paragraph,
            button: button,
            button_link: button_link,
            button_text: button_text,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
            is_video: is_video
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      }
      if (bannerInfo) {
        const bannerInformation = await BannersData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

        await trn.commit()
        return resSuccess({ data: bannerInformation })
      }
    } else {
      return resNotFound()
    }

    await trn.commit()

  } catch (error) {
    await trn.rollback()
    throw (error);
  }

}
export const deleteBanner = async (req: Request) => {

  try {
    const bannerExists = await BannersData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(bannerExists && bannerExists.dataValues)) {
      return resNotFound();
    }
    await BannersData.update(
      {
        is_deleted: "1",
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: bannerExists.dataValues.id } }
    );

    return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
  } catch (error) {
    throw error
  }
}
export const statusUpdateBanner = async (req: Request) => {
  try {
    const bannerExists = await BannersData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
    if (bannerExists) {
      const bannerActionInfo = await (BannersData.update(
        {
          status: req.body.is_active,
          modified_date: getLocalDate(),
          modified_by: req.body.session_res.id_app_user
        },
        { where: { id: bannerExists.dataValues.id } }
      ));
      if (bannerActionInfo) {
        return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
      }
    } else {
      return resNotFound();
    }
  } catch (error) {
    throw error
  }
}


////////////////////// Project //////////////////////

export const addProject = async (req: Request) => {
  const { name, description, architecture, location, specification, is_latest, area_of_construction, no_of_building, no_of_stories, year, owner, project_status, progress, project_description } = req.body
  const trn = await dbContext.transaction();
  try {
    var files = req.files as any;

    let thumbnail = files.thumbnail;
    let images = files.images;

    let idthumbnail = null

    if (thumbnail) {
      const moveFileResult = await moveFileToFps(
        thumbnail[0]
      );

      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }
      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.Project,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idthumbnail = imageResult.dataValues.id;
    }

    const payload = {
      name: name,
      description: description,
      architecture: architecture,
      location: location,
      specification: specification,
      is_latest: is_latest,
      created_date: getLocalDate(),
      is_deleted: DeletedStaus.InDeleted,
      created_by: req.body.session_res.id_app_user,
      status: ActiveStatus.Active,
      // image_id: idimage,
      thumbnail_image_id: idthumbnail,
      year: year,
      area_of_construction: area_of_construction,
      no_of_building: no_of_building,
      no_of_stories: no_of_stories,
      owner: owner,
      project_description: project_description,
      project_status: (project_status == 2 || project_status === 'Completed') ? 'Completed' : (project_status == 1 || project_status === 'Ongoing') ? 'Ongoing' : 'Upcoming',
      progress: progress
    }

    const project: any = await ProjectData.create(payload, { transaction: trn })

    if (images && images.length > 0) {
      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        const moveFileResult = await moveFileToFps(
          image
        );
        if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
          return moveFileResult;
        }
        console.log(project.dataValues.id, "Check project");

        const imageResult = await ProjectImages.create(
          {
            image_path: moveFileResult.data,
            image_type: IMAGE_TYPE.Banner,
            created_by: req.body.session_res.id_app_user,
            created_date: getLocalDate(),
            project_id: project.dataValues.id,
            status: ActiveStatus.Active,
            is_deleted: DeletedStaus.InDeleted,
          },
          { transaction: trn }
        );
      }
    }
    await trn.commit()
    return resSuccess({ data: payload });
  } catch (error) {
    await trn.rollback()
    throw (error)
  }
}
export const getAllProject = async (req: Request) => {
  try {
    let paginationProps = {};

    let pagination = {
      ...getInitialPaginationFromQuery(req.query),
      search_text: req.query.search_text,
    };
    let noPagination = req.query.no_pagination === "1";

    let where = [
      { is_deleted: DeletedStaus.InDeleted },
      pagination.is_active ? { status: pagination.is_active } : {},
      pagination.search_text
        ? {
          [Op.or]: [
            { location: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { name: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { description: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { architecture: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { owner: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { no_of_stories: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { no_of_building: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { area_of_construction: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { year: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { no_of_building: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { no_of_stories: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { project_status: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            // { progress: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
        }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await ProjectData.count({
        where,
      });

      if (totalItems === 0) {
        return resSuccess({ data: { pagination, result: [] } });
      }
      pagination.total_items = totalItems;
      pagination.total_pages = Math.ceil(totalItems / pagination.per_page_rows);

      paginationProps = {
        limit: pagination.per_page_rows,
        offset: (pagination.current_page - 1) * pagination.per_page_rows,
      };
    }

    const result = await ProjectData.findAll({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      include: [
        { model: Image, as: "image", attributes: [] },
        { model: Image, as: "thumbnail_image", attributes: [] },
      ],
      attributes: [
        "id",
        "name",
        "description",
        "architecture",
        "location",
        "specification",
        "created_date",
        "modified_date",
        "is_deleted",
        "created_date",
        "modified_date",
        "status",
        "year",
        "owner",
        "project_description",
        "area_of_construction",
        "no_of_building",
        "no_of_stories",
        "project_status",
        "progress",
        [Sequelize.literal('(select json_agg(json_build_object(\'id\', id, \'image_path\', image_path)) from project_images where project_images.project_id = projects.id and project_images.is_deleted = 0)'), 'images'],
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
        [Sequelize.literal("thumbnail_image.image_path"), "thumbnail_image_path"],
        [Sequelize.literal("thumbnail_image.id"), "thumbnail_image_id"],
      ],
    });

    return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
}
export const getLatestProject = async (req: Request) => {
  try {
    let where = [
      { is_latest: true },
      { status: ActiveStatus.Active },
      { is_deleted: DeletedStaus.InDeleted }
    ];

    const result = await ProjectData.findAll({
      where,
      include: [
        { model: Image, as: "image", attributes: [] },
        { model: Image, as: "thumbnail_image", attributes: [] },
      ],
      attributes: [
        "name",
        "description",
        "architecture",
        "location",
        "specification",
        "created_date",
        "project_status",
        "project_description",
        "progress",
        [Sequelize.literal('(select json_agg(json_build_object(\'id\', id, \'image_path\', image_path)) from project_images where project_images.project_id = projects.id and project_images.is_deleted = 0)'), 'images'],
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
        [Sequelize.literal("thumbnail_image.image_path"), "thumbnail_image_path"],
        [Sequelize.literal("thumbnail_image.id"), "thumbnail_image_id"],
      ],
    });

    return resSuccess({ data: result });
  } catch (error) {
    throw error;
  }
}
export const getProject = async (req: Request) => {
  try {
    let where: any = [
      { status: ActiveStatus.Active },
      { is_deleted: DeletedStaus.InDeleted },
      req.query.project_status !== undefined ? { project_status: req.query.project_status } : {}
    ];
    // console.log(where ,"check where");

    const result = await ProjectData.findAll({
      where,
      include: [
        { model: Image, as: "image", attributes: [] },
        { model: Image, as: "thumbnail_image", attributes: [] },
      ],
      attributes: [
        "id",
        "name",
        "description",
        "architecture",
        "location",
        "specification",
        "created_date",
        "modified_date",
        "is_deleted",
        "created_date",
        "project_description",
        "modified_date",
        // "status",
        "year",
        "owner",
        "area_of_construction",
        "no_of_building",
        "no_of_stories",
        "project_status",
        "progress",
        [Sequelize.literal('(select json_agg(json_build_object(\'id\', id, \'image_path\', image_path)) from project_images where project_images.project_id = projects.id and project_images.is_deleted = 0)'), 'images'],
        // [Sequelize.literal(`select id,image_path from project_images where status = '1' and is_deleted = '0' where project_id = projects.id`), "other_images"],
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
        [Sequelize.literal("thumbnail_image.image_path"), "thumbnail_image_path"],
        [Sequelize.literal("thumbnail_image.id"), "thumbnail_image_id"],
      ],
      order: [['id', 'DESC']],
    });

    return resSuccess({ data: result });
  } catch (error) {
    throw error;
  }
}
export const getByIdProject = async (req: Request) => {
  try {
    console.log(req.params.id);
    const banner = await ProjectData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(banner && banner.dataValues)) {
      return resNotFound();
    }
    return resSuccess({ data: banner })
  } catch (error) {
    throw error
  }
}
export const updateProject = async (req: Request) => {
  const { id, name, description, architecture, location, specification, is_latest, area_of_construction, no_of_building, no_of_stories, year, owner, project_status, progress, project_description } = req.body

  const trn = await dbContext.transaction();

  try {
    var files = req.files as any;

    let thumbnail = files.thumbnail;
    let images = files.images;

    let idthumbnail = null

    if (thumbnail) {
      const moveFileResult = await moveFileToFps(
        thumbnail[0]
      );
      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }
      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.Project,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idthumbnail = imageResult.dataValues.id;
    }

    const projectId = await ProjectData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

    if (projectId) {

      let bannerInfo;
      if (idthumbnail) {

        bannerInfo = await (ProjectData.update(
          {
            name: name,
            description: description || project_description,
            architecture: architecture,
            location: location,
            specification: specification,
            is_latest: is_latest,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
            thumbnail_image_id: idthumbnail,
            year: year,
            area_of_construction: area_of_construction,
            no_of_building: no_of_building,
            no_of_stories: no_of_stories,
            owner: owner,
            project_status: (project_status == 2 || project_status === 'Completed') ? 'Completed' : (project_status == 1 || project_status === 'Ongoing') ? 'Ongoing' : 'Upcoming',
            progress: progress,
            project_description: project_description || description
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      } else {
        bannerInfo = await (ProjectData.update(
          {
            name: name,
            description: description || project_description,
            architecture: architecture,
            location: location,
            specification: specification,
            is_latest: is_latest,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
            year: year,
            area_of_construction: area_of_construction,
            no_of_building: no_of_building,
            no_of_stories: no_of_stories,
            owner: owner,
            project_status: (project_status == 2 || project_status === 'Completed') ? 'Completed' : (project_status == 1 || project_status === 'Ongoing') ? 'Ongoing' : 'Upcoming',
            progress: progress,
            project_description: project_description || description
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      }
      if (images && images.length > 0) {
        for (let index = 0; index < images.length; index++) {
          const image = images[index];
          const moveFileResult = await moveFileToFps(
            image
          );
          if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
            await trn.rollback();
            return moveFileResult;
          }

          const imageResult = await ProjectImages.create(
            {
              image_path: moveFileResult.data,
              image_type: IMAGE_TYPE.Banner,
              created_by: req.body.session_res.id_app_user,
              created_date: getLocalDate(),
              project_id: id,
              status: ActiveStatus.Active,
              is_deleted: DeletedStaus.InDeleted,
            },
            { transaction: trn }
          );
        }
      }
      if (bannerInfo) {
        const bannerInformation = await ProjectData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

        await trn.commit()
        return resSuccess({ data: bannerInformation })
      }

    } else {
      await trn.commit(); // Ensure to close transaction even if not found (or rollback, but commit is fine for read-only)
      return resNotFound()
    }

    await trn.commit()

  } catch (error) {
    if (trn) await trn.rollback();
    throw (error);
  }

}
export const deleteProject = async (req: Request) => {

  try {
    const bannerExists = await ProjectData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(bannerExists && bannerExists.dataValues)) {
      return resNotFound();
    }
    await ProjectData.update(
      {
        is_deleted: "1",
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: bannerExists.dataValues.id } }
    );

    return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
  } catch (error) {
    throw error
  }
}
export const deleteProjectImage = async (req: Request) => {

  try {
    const exists = await ProjectImages.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(exists && exists.dataValues)) {
      return resNotFound();
    }
    await ProjectImages.update(
      {
        is_deleted: "1",
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: exists.dataValues.id } }
    );

    return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
  } catch (error) {
    throw error
  }
}
export const statusUpdateProject = async (req: Request) => {
  try {
    const bannerExists = await ProjectData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
    if (bannerExists) {
      const bannerActionInfo = await (ProjectData.update(
        {
          status: req.body.is_active,
          modified_date: getLocalDate(),
          modified_by: req.body.session_res.id_app_user
        },
        { where: { id: bannerExists.dataValues.id } }
      ));
      if (bannerActionInfo) {
        return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
      }
    } else {
      return resNotFound();
    }
  } catch (error) {
    throw error
  }
}

////////////////////// Contact Us //////////////////////

export const addCotactUs = async (req: Request) => {
  const { full_name, email, phonecode, phone, subject, message } = req.body
  const trn = await dbContext.transaction();
  try {

    const payload = {
      fullname: full_name,
      email: email,
      phonecode: phonecode,
      phone: phone,
      subject: subject,
      message: message,
      created_date: getLocalDate(),
      is_deleted: DeletedStaus.InDeleted,
      created_by: req.body.session_res.id_app_user,
      status: ActiveStatus.Active,
    }

    await ContactUs.create(payload, { transaction: trn })
    await trn.commit()
    return resSuccess({ data: payload });
  } catch (error) {
    await trn.rollback()
    throw (error)
  }
}
export const getAllCotactUs = async (req: Request) => {
  try {
    let paginationProps = {};

    let pagination = {
      ...getInitialPaginationFromQuery(req.query),
      search_text: req.query.search_text,
    };
    let noPagination = req.query.no_pagination === "1";

    let where = [
      { is_deleted: DeletedStaus.InDeleted },
      pagination.is_active ? { status: pagination.is_active } : {},
      pagination.search_text
        ? {
          [Op.or]: [
            { fullname: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { email: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { phone: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { subject: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
        }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await ContactUs.count({
        where,
      });

      if (totalItems === 0) {
        return resSuccess({ data: { pagination, result: [] } });
      }
      pagination.total_items = totalItems;
      pagination.total_pages = Math.ceil(totalItems / pagination.per_page_rows);

      paginationProps = {
        limit: pagination.per_page_rows,
        offset: (pagination.current_page - 1) * pagination.per_page_rows,
      };
    }

    const result = await ContactUs.findAll({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      attributes: [
        "id",
        "fullname",
        "email",
        "phonecode",
        "phone",
        "subject",
        "message",
        "modified_date",
        "is_deleted",
        "created_date",
        "modified_date",
        "status"
      ],
    });

    return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
}

////////////////////// Feedback //////////////////////

export const addFeedback = async (req: Request) => {
  const { fullname, designation, feedback, is_video } = req.body
  const trn = await dbContext.transaction();
  try {
    let idImage = null

    if (req.file) {
      if (req.file.size > 5000000) {
        return resBadRequest({ message: FILE_SIZE_5MB })
      }
      const moveFileResult = await moveFileToFps(
        req.file
      );

      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.profile,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;
    }

    const payload = {
      fullname: fullname,
      designation: designation,
      feedback: feedback,
      created_date: getLocalDate(),
      is_deleted: DeletedStaus.InDeleted,
      created_by: req.body.session_res.id_app_user,
      status: ActiveStatus.Active,
      image_id: idImage,
      is_video: is_video
    }

    await FeedbackData.create(payload, { transaction: trn })
    await trn.commit()

    return resSuccess({ data: payload });
  } catch (error) {

    await trn.rollback()
    throw (error)
  }
}
export const getAllFeedback = async (req: Request) => {
  try {
    let paginationProps = {};

    let pagination = {
      ...getInitialPaginationFromQuery(req.query),
      search_text: req.query.search_text,
    };
    let noPagination = req.query.no_pagination === "1";

    let where = [
      { is_deleted: DeletedStaus.InDeleted },
      pagination.is_active ? { status: pagination.is_active } : {},
      pagination.search_text
        ? {
          [Op.or]: [
            { fullname: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { designation: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            { feedback: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
        }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await FeedbackData.count({
        where,
      });

      if (totalItems === 0) {
        return resSuccess({ data: { pagination, result: [] } });
      }
      pagination.total_items = totalItems;
      pagination.total_pages = Math.ceil(totalItems / pagination.per_page_rows);

      paginationProps = {
        limit: pagination.per_page_rows,
        offset: (pagination.current_page - 1) * pagination.per_page_rows,
      };
    }

    const result = await FeedbackData.findAll({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "fullname",
        "designation",
        "is_video",
        "feedback",
        "created_date",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
      ],
    });

    return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
}
export const getFeedback = async (req: Request) => {
  try {
    let where = [
      { status: ActiveStatus.Active },
      { is_deleted: DeletedStaus.InDeleted }
    ];

    const result = await FeedbackData.findAll({
      where,
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "fullname",
        "designation",
        "is_video",
        "feedback",
        "created_date",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
      ],
    });

    const client = await ClintSayData.findOne({
      order: [['id', 'DESC']],
      attributes: [
        "id",
        "title",
        "description"
      ],
    });

    return resSuccess({ data: { result, client } });
  } catch (error) {
    throw error;
  }
}
export const getByIdFeedback = async (req: Request) => {
  try {
    console.log(req.params.id);
    const banner = await FeedbackData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(banner && banner.dataValues)) {
      return resNotFound();
    }
    return resSuccess({ data: banner })
  } catch (error) {
    throw error
  }
}
export const updateFeedback = async (req: Request) => {
  const { id, fullname, designation, feedback, is_video } = req.body
  const trn = await dbContext.transaction();

  try {
    let idImage = null
    if (req.file) {
      if (req.file.size > 5000000) {
        return resBadRequest({ message: FILE_SIZE_5MB })
      }
      const moveFileResult = await moveFileToFps(
        req.file
      );
      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.Banner,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;

    }

    const bannerId = await FeedbackData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

    if (bannerId) {

      let updatePayload: any = {
        fullname: fullname,
        designation: designation,
        feedback: feedback,
        modified_date: getLocalDate(),
        modified_by: req.body.session_res.id_app_user,
      };

      if (idImage) {
        updatePayload.image_id = idImage;
      }

      if (is_video !== undefined && is_video !== "") {
        updatePayload.is_video = is_video;
      }

      const bannerInfo = await FeedbackData.update(
        updatePayload,
        { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
      );

      if (bannerInfo) {
        const bannerInformation = await FeedbackData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }], transaction: trn });

        await trn.commit()
        return resSuccess({ data: bannerInformation })

      } else {
        await trn.rollback()
        return resErrorDataExit()
      }
    } else {
      return resNotFound()
    }

    await trn.commit()

  } catch (error) {
    await trn.rollback()
    throw (error);
  }

}
export const deleteFeedback = async (req: Request) => {

  try {
    const bannerExists = await FeedbackData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(bannerExists && bannerExists.dataValues)) {
      return resNotFound();
    }
    await FeedbackData.update(
      {
        is_deleted: "1",
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: bannerExists.dataValues.id } }
    );

    return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
  } catch (error) {
    throw error
  }
}
export const statusUpdateFeedback = async (req: Request) => {
  try {
    const bannerExists = await FeedbackData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
    if (bannerExists) {
      const bannerActionInfo = await (FeedbackData.update(
        {
          status: req.body.is_active,
          modified_date: getLocalDate(),
          modified_by: req.body.session_res.id_app_user
        },
        { where: { id: bannerExists.dataValues.id } }
      ));
      if (bannerActionInfo) {
        return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
      }
    } else {
      return resNotFound();
    }
  } catch (error) {
    throw error
  }
}


////////////////////// What client say //////////////////////

export const getWhatClientSay = async (req: Request) => {
  try {

    const result = await ClintSayData.findOne({
      order: [['id', 'DESC']],
      attributes: [
        "id",
        "title",
        "description"
      ],
    });

    return resSuccess({ data: result });
  } catch (error) {
    throw error;
  }
}
export const updateWhatClientSay = async (req: Request) => {
  const { id, title, description } = req.body

  try {
    if (!id || id === 'undefined' || id === '') {
      const payload = {
        title: title,
        description: description,
        created_by: req.body.session_res?.id_app_user,
        created_date: getLocalDate()
      };
      await ClintSayData.create(payload);
      return resSuccess({ message: "Data created successfully!", data: payload });
    }

    let client = await (ClintSayData.update(
      {
        title: title,
        description: description,
        modified_by: req.body.session_res?.id_app_user,
        modified_date: getLocalDate()
      },
      { where: { id: id } }
    ));
    return resSuccess({ message: "Data updated successfully!", data: { id, title, description } });


  } catch (error) {
    throw (error);
  }

}

////////////////////// Group of Companies //////////////////////

export const addGroupOfCompany = async (req: Request) => {
  const { name } = req.body
  const trn = await dbContext.transaction();
  try {
    let idImage = null

    if (req.file) {
      const moveFileResult = await moveFileToFps(
        req.file
      );

      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.profile,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;
    }

    const payload = {
      name: name,
      created_date: getLocalDate(),
      is_deleted: DeletedStaus.InDeleted,
      created_by: req.body.session_res.id_app_user,
      status: ActiveStatus.Active,
      image_id: idImage
    }

    await GroupOfCompanyData.create(payload, { transaction: trn })
    await trn.commit()

    return resSuccess({ data: payload });
  } catch (error) {

    await trn.rollback()
    throw (error)
  }
}
export const getAllGroupOfCompany = async (req: Request) => {
  try {
    let paginationProps = {};

    let pagination = {
      ...getInitialPaginationFromQuery(req.query),
      search_text: req.query.search_text,
    };
    let noPagination = req.query.no_pagination === "1";

    let where = [
      { is_deleted: DeletedStaus.InDeleted },
      pagination.is_active ? { status: pagination.is_active } : {},
      pagination.search_text
        ? {
          [Op.or]: [
            { name: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
        }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await GroupOfCompanyData.count({
        where,
      });

      if (totalItems === 0) {
        return resSuccess({ data: { pagination, result: [] } });
      }
      pagination.total_items = totalItems;
      pagination.total_pages = Math.ceil(totalItems / pagination.per_page_rows);

      paginationProps = {
        limit: pagination.per_page_rows,
        offset: (pagination.current_page - 1) * pagination.per_page_rows,
      };
    }

    const result = await GroupOfCompanyData.findAll({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "name",
        "created_date",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
      ],
    });

    return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
}
export const getGroupOfCompany = async (req: Request) => {
  try {
    let where = [
      { status: ActiveStatus.Active },
      { is_deleted: DeletedStaus.InDeleted }
    ];

    const result = await GroupOfCompanyData.findAll({
      where,
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "name",
        "created_date",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
      ],
    });


    return resSuccess({ data: { result } });
  } catch (error) {
    throw error;
  }
}
export const getByIdGroupOfCompany = async (req: Request) => {
  try {
    console.log(req.params.id);
    const banner = await GroupOfCompanyData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(banner && banner.dataValues)) {
      return resNotFound();
    }
    return resSuccess({ data: banner })
  } catch (error) {
    throw error
  }
}
export const updateGroupOfCompany = async (req: Request) => {
  const { id, name } = req.body
  const trn = await dbContext.transaction();

  try {
    let idImage = null
    if (req.file) {
      const moveFileResult = await moveFileToFps(
        req.file
      );
      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.Banner,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;

    }

    const bannerId = await GroupOfCompanyData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

    if (bannerId) {
      let bannerInfo;
      if (idImage) {

        bannerInfo = await (GroupOfCompanyData.update(
          {
            name: name,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
            image_id: idImage
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      } else {
        bannerInfo = await (GroupOfCompanyData.update(
          {
            name: name,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      }
      if (bannerInfo) {
        const bannerInformation = await GroupOfCompanyData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

        await trn.commit()
        return resSuccess({ data: bannerInformation })

      } else {
        await trn.rollback()
        return resErrorDataExit()
      }
    } else {
      return resNotFound()
    }

    await trn.commit()

  } catch (error) {
    await trn.rollback()
    throw (error);
  }

}
export const deleteGroupOfCompany = async (req: Request) => {

  try {
    const bannerExists = await GroupOfCompanyData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(bannerExists && bannerExists.dataValues)) {
      return resNotFound();
    }
    await GroupOfCompanyData.update(
      {
        is_deleted: "1",
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: bannerExists.dataValues.id } }
    );

    return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
  } catch (error) {
    throw error
  }
}
export const statusUpdateGroupOfCompany = async (req: Request) => {
  try {
    const bannerExists = await GroupOfCompanyData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
    if (bannerExists) {
      const bannerActionInfo = await (GroupOfCompanyData.update(
        {
          status: req.body.is_active,
          modified_date: getLocalDate(),
          modified_by: req.body.session_res.id_app_user
        },
        { where: { id: bannerExists.dataValues.id } }
      ));
      if (bannerActionInfo) {
        return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
      }
    } else {
      return resNotFound();
    }
  } catch (error) {
    throw error
  }
}

////////////////////// Group of Companies //////////////////////

export const addSolarPlan = async (req: Request) => {
  const { title, paragraph } = req.body
  const trn = await dbContext.transaction();
  try {
    let idImage = null

    if (req.file) {
      const moveFileResult = await moveFileToFps(
        req.file
      );

      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.profile,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;
    }

    const payload = {
      title: title,
      paragraph: paragraph,
      created_date: getLocalDate(),
      is_deleted: DeletedStaus.InDeleted,
      created_by: req.body.session_res.id_app_user,
      status: ActiveStatus.Active,
      image_id: idImage
    }

    await SolarPanelData.create(payload, { transaction: trn })
    await trn.commit()

    return resSuccess({ data: payload });
  } catch (error) {

    await trn.rollback()
    throw (error)
  }
}
export const getAllSolarPlan = async (req: Request) => {
  try {
    let paginationProps = {};

    let pagination = {
      ...getInitialPaginationFromQuery(req.query),
      search_text: req.query.search_text,
    };
    let noPagination = req.query.no_pagination === "1";

    let where = [
      { is_deleted: DeletedStaus.InDeleted },
      pagination.is_active ? { status: pagination.is_active } : {},
      pagination.search_text
        ? {
          [Op.or]: [
            { name: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
        }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await SolarPanelData.count({
        where,
      });

      if (totalItems === 0) {
        return resSuccess({ data: { pagination, result: [] } });
      }
      pagination.total_items = totalItems;
      pagination.total_pages = Math.ceil(totalItems / pagination.per_page_rows);

      paginationProps = {
        limit: pagination.per_page_rows,
        offset: (pagination.current_page - 1) * pagination.per_page_rows,
      };
    }

    const result = await SolarPanelData.findOne({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "title",
        "paragraph",
        "created_date",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
      ],
    });

    return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
}
export const getSolarPlan = async (req: Request) => {
  try {
    let where = [
      { status: ActiveStatus.Active },
      { is_deleted: DeletedStaus.InDeleted }
    ];

    const result = await SolarPanelData.findOne({
      where,
      order: [['id', 'DESC']],
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "title",
        "paragraph",
        "created_date",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"],
      ],
    });


    return resSuccess({ data: { result } });
  } catch (error) {
    throw error;
  }
}
export const getByIdSolarPlan = async (req: Request) => {
  try {
    console.log(req.params.id);
    const banner = await SolarPanelData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(banner && banner.dataValues)) {
      return resNotFound();
    }
    return resSuccess({ data: banner })
  } catch (error) {
    throw error
  }
}
export const updateSolarPlan = async (req: Request) => {
  const { id, title, paragraph } = req.body

  const trn = await dbContext.transaction();

  try {
    let idImage = null
    if (req.file) {
      const moveFileResult = await moveFileToFps(
        req.file
      );
      if (moveFileResult.code !== DEFAULT_STATUS_CODE_SUCCESS) {
        await trn.rollback();
        return moveFileResult;
      }

      const imageResult = await Image.create(
        {
          image_path: moveFileResult.data,
          image_type: IMAGE_TYPE.Banner,
          created_by: req.body.session_res.id_app_user,
          created_date: getLocalDate(),
        },
        { transaction: trn }
      );

      idImage = imageResult.dataValues.id;

    }

    if (!id || id === 'undefined' || id === '') {
      const payload = {
        title: title,
        paragraph: paragraph,
        created_date: getLocalDate(),
        is_deleted: DeletedStaus.InDeleted,
        created_by: req.body.session_res.id_app_user,
        status: ActiveStatus.Active,
        image_id: idImage
      };
      await SolarPanelData.create(payload, { transaction: trn });
      await trn.commit();
      return resSuccess({ message: "Green Environment created successfully!" });
    }

    const bannerId = await SolarPanelData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

    if (bannerId) {
      let bannerInfo;
      if (idImage) {

        bannerInfo = await (SolarPanelData.update(
          {
            title: title,
            paragraph: paragraph,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
            image_id: idImage
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      } else {
        bannerInfo = await (SolarPanelData.update(
          {
            title: title,
            paragraph: paragraph,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user,
          },
          { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
        ));
      }
      if (bannerInfo) {
        const bannerInformation = await SolarPanelData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

        await trn.commit()
        return resSuccess({ data: bannerInformation })

      } else {
        await trn.rollback()
        return resErrorDataExit()
      }
    } else {
      return resNotFound()
    }

    await trn.commit()

  } catch (error) {
    await trn.rollback()
    throw (error);
  }

}
export const deleteSolarPlan = async (req: Request) => {

  try {
    const bannerExists = await SolarPanelData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(bannerExists && bannerExists.dataValues)) {
      return resNotFound();
    }
    await SolarPanelData.update(
      {
        is_deleted: "1",
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: bannerExists.dataValues.id } }
    );

    return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
  } catch (error) {
    throw error
  }
}
export const statusUpdateSolarPlan = async (req: Request) => {
  try {
    const bannerExists = await SolarPanelData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
    if (bannerExists) {
      const bannerActionInfo = await (SolarPanelData.update(
        {
          status: req.body.is_active,
          modified_date: getLocalDate(),
          modified_by: req.body.session_res.id_app_user
        },
        { where: { id: bannerExists.dataValues.id } }
      ));
      if (bannerActionInfo) {
        return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
      }
    } else {
      return resNotFound();
    }
  } catch (error) {
    throw error
  }
}
