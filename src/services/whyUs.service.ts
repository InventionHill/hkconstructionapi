import { Request } from "express";
import { Op,Sequelize, where } from "sequelize";
import { ActiveStatus, DeletedStaus, IMAGE_TYPE } from "../utils/app-enumeration";
import { DEFAULT_STATUS_CODE_SUCCESS, RECORD_DELETE_SUCCESSFULLY, RECORD_UPDATE_SUCCESSFULLY } from "../utils/app-messages";
import { getInitialPaginationFromQuery, getLocalDate, resErrorDataExit, resNotFound, resSuccess,columnValueLowerCase} from "../utils/shared-functions";
import { moveFileToFps } from "../helpers/file.helper";
import Image from "../model/image.model";
import dbContext from "../config/db-context";
import WhyUsData from "../model/whyus.model";
import AwardsData from "../model/awards.model";
import WhyUsFeaturesData from "../model/whyus_features.model";

//////////////////////////////////////////////////////////////////
///////////////////////////// Why Us Page ////////////////////////
//////////////////////////////////////////////////////////////////

///////////////////// Fronted /////////////////////

export const getWhyUsData = async (req: Request) => {
    try {  
        let where = {
            is_deleted: DeletedStaus.InDeleted,
        };

        const result = await WhyUsData.findOne({
            where,
            include: [
                { model: Image, as: "main_image", attributes: [] },
                { model: Image, as: "logo_image", attributes: [] },
            ],
            attributes: [
                "id",
                "title1",
                "title2",
                "description",
                [
                    Sequelize.literal(`(
                        SELECT array_agg(json_build_object('id', awards.id, 'title', title, 'year', year, 'image_path', images.image_path))
                        FROM awards
                        LEFT JOIN images ON awards.image_id = images.id
                        WHERE awards.is_deleted = '0' AND awards.status = '1'
                    )`),
                    'awards'
                ],
                [
                    Sequelize.literal(`(
                        SELECT array_agg(json_build_object('id', whyus_features.id, 'title', title, 'description', description, 'icon_path', icon.image_path, 'image_path', images.image_path))
                        FROM whyus_features
                        LEFT JOIN images ON whyus_features.image_id = images.id
                        LEFT JOIN images as icon ON whyus_features.icon_id = icon.id                        
                        WHERE whyus_features.is_deleted = '0' AND whyus_features.status = '1'
                    )`),
                    'features'
                ],
                [Sequelize.literal("main_image.image_path"), "main_image_path"],
                [Sequelize.literal("main_image.id"), "main_image_id"],
                [Sequelize.literal("logo_image.image_path"), "logo_image_path"],
                [Sequelize.literal("logo_image.id"), "logo_image_id"],
            ],
        });

        return resSuccess({ data: result });
    } catch (error) {
        throw error;
    }
}

///////////////////// Admin /////////////////////

export const addWhyUs = async (req: Request) => {
    const { title1,title2,description} = req.body
    const trn = await dbContext.transaction();
    try {
        var files = req.files as any;
        let image = files.image[0];
        let logo = files.logo[0];
        let idImage = null
        let idLogo = null
        if (image) {
            // const moveFileResult = await moveFileToS3ByType(
            //     image,
            //   IMAGE_TYPE.Banner
            // );
            const moveFileResult = await moveFileToFps(
              image
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
        if (logo) {
            // const moveFileResult = await moveFileToS3ByType(
            //   logo,
            //   IMAGE_TYPE.Banner
            // );
            const moveFileResult = await moveFileToFps(
              logo
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
      
            idLogo = imageResult.dataValues.id;
        }
        const payload = {
            title1: title1,
            title2: title2,
            description: description,
            created_date: getLocalDate(),
            is_deleted: DeletedStaus.InDeleted,
            created_by: req.body.session_res.id_app_user,
            status: ActiveStatus.Active,
            main_image_id: idImage,
            sml_logo_id:idLogo
        } 
        await WhyUsData.create(payload, {transaction: trn})
        await trn.commit()
        return resSuccess({data: payload});
    } catch (error) {
        await trn.rollback()
        throw (error)
    }
}
export const getWhyUs = async (req: Request) => {
    try {  
        let where = [
          { is_deleted: DeletedStaus.InDeleted },
        ];    
        const result = await WhyUsData.findOne({
          where,
          include: [
              { model: Image, as: "main_image", attributes: [] },
              { model: Image, as: "logo_image", attributes: [] },
          ],
          attributes: [
              "id",
              "title1",
              "title2",
              "description",
              [
                  Sequelize.literal(`(
                      SELECT array_agg(json_build_object('id', awards.id, 'title', title, 'year', year, 'image_path', images.image_path))
                      FROM awards
                      LEFT JOIN images ON awards.image_id = images.id
                      WHERE awards.is_deleted = '0' AND awards.status = '1'
                  )`),
                  'awards'
              ],
              [
                  Sequelize.literal(`(
                      SELECT array_agg(json_build_object('id', whyus_features.id, 'title', title, 'description', description, 'icon_path', icon.image_path, 'image_path', images.image_path))
                      FROM whyus_features
                      LEFT JOIN images ON whyus_features.image_id = images.id
                      LEFT JOIN images as icon ON whyus_features.icon_id = icon.id                        
                      WHERE whyus_features.is_deleted = '0' AND whyus_features.status = '1'
                  )`),
                  'features'
              ],
              [Sequelize.literal("main_image.image_path"), "main_image_path"],
              [Sequelize.literal("main_image.id"), "main_image_id"],
              [Sequelize.literal("logo_image.image_path"), "logo_image_path"],
              [Sequelize.literal("logo_image.id"), "logo_image_id"],
          ],
      });
    
        return resSuccess({  data : result  });
      } catch (error) {
        throw error;
      }
}
export const updateWhyUs = async (req: Request) => {
    const { id,title1,title2,description} = req.body
    const trn = await dbContext.transaction();

    try { 
        var files = req.files as any;
        let image = files.image;
        let logo = files.logo;
        let idImage = null
        let idLogo = null
        
        if (image) {
            // const moveFileResult = await moveFileToS3ByType(
            //     image,
            //   IMAGE_TYPE.Banner
            // );
            const moveFileResult = await moveFileToFps(
              image[0]
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
        if (logo) {
            // const moveFileResult = await moveFileToS3ByType(
            //   logo,
            //   IMAGE_TYPE.Banner
            // );
            const moveFileResult = await moveFileToFps(
              logo[0]
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
      
            idLogo = imageResult.dataValues.id;
        }

        const whyUsId = await WhyUsData.findOne({ where: [ {id: id },{is_deleted: DeletedStaus.InDeleted}] });        
        if (whyUsId) {     
            let whyUsInfo;    
            if(idImage && idLogo) {
              
                whyUsInfo = await (WhyUsData.update(
                 {
                    title1: title1,
                    title2: title2,
                    description: description,
                    modified_date: getLocalDate(),
                    modified_by: req.body.session_res.id_app_user,
                    main_image_id: idImage,
                    sml_logo_id:idLogo                            
                 },
                 { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
               ));
             } else {
               whyUsInfo = await (WhyUsData.update(
                 {
                    title1: title1,
                    title2: title2,
                    description: description,
                    modified_date: getLocalDate(),
                    modified_by: req.body.session_res.id_app_user,
                 },
                 { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
               ));
             }
            
            if (whyUsInfo) {
                const bannerInformation = await WhyUsData.findOne({ where: [ {id: id },{is_deleted: DeletedStaus.InDeleted}] });

              await trn.commit()
              return resSuccess({data: bannerInformation})
            }
        }else {
            return resNotFound() 
        }
  
        await trn.commit()
    
    } catch (error) {
      
        await trn.rollback()
        throw(error);
    }

}

///////////////////// Awards /////////////////////

export const addAward = async (req: Request) => {
    const { title, year} = req.body
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

        const payload = {
            title: title,
            year: year,
            created_date: getLocalDate(),
            is_deleted: DeletedStaus.InDeleted,
            created_by: req.body.session_res.id_app_user,
            status: ActiveStatus.Active,
            image_id: idImage
        } 

        await AwardsData.create(payload, {transaction: trn})
        await trn.commit()
        return resSuccess({data: payload});
    } catch (error) {
        await trn.rollback()
        throw (error)
    }
}
export const getAllAward = async (req: Request) => {
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
              { title: { [Op.iLike]: "%" + pagination.search_text  + "%" } },
              Sequelize.literal(`CAST("year" AS TEXT) ILIKE '%' || '${pagination.search_text}' || '%'`),
              // { year: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
            }
          : {},
      ];
  
      if (!noPagination) {
        const totalItems = await AwardsData.count({
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
  
      const result = await AwardsData.findAll({
        ...paginationProps,
        where,
        order: [[pagination.sort_by, pagination.order_by]],
        include: [
          { model: Image, as: "image", attributes: [] },
        ],
        attributes: [
          "id",
          "title",
          "year",
          "created_date",
          "modified_date",
          "is_deleted",
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
export const getAward = async (req: Request) => {
    try {
      let paginationProps = {};
  
      let pagination = {
        ...getInitialPaginationFromQuery(req.query),
        search_text: req.query.search_text,
      };
      let noPagination = req.query.no_pagination === "1";
  
      let where = [
        {status : ActiveStatus.Active},
        { is_deleted: DeletedStaus.InDeleted },
        pagination.is_active ? { status: pagination.is_active } : {},
        pagination.search_text
          ? {
            [Op.or]: [
              { content: { [Op.iLike]: "%" + pagination.search_text  + "%" } },
              { link: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
            }
          : {},
      ];
  
      if (!noPagination) {
        const totalItems = await AwardsData.count({
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
  
      const result = await AwardsData.findAll({
        ...paginationProps,
        where,
        order: [[pagination.sort_by, pagination.order_by]],
        include: [
          { model: Image, as: "image", attributes: [] },
        ],
        attributes: [
          "id",
          "title",
          "year",
          "created_date",
          [Sequelize.literal("image.image_path"), "image_path"],
        ],
      });
  
      return resSuccess({ data: noPagination ? result : { pagination, result } });
    } catch (error) {
      throw error;
    }
}
export const getByIdAward = async (req: Request) => {
    try {
        console.log(req.params.id);
        const banner = await AwardsData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });
    
        if (!(banner && banner.dataValues)) {
            return resNotFound();
          }
          return resSuccess({data: banner})
    } catch (error) {
        throw error
    }
}
export const updateAward = async (req: Request) => {
    const { id,title, year} = req.body
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

        const awardsId = await AwardsData.findOne({ where: [ {id: id },{is_deleted: DeletedStaus.InDeleted}] });
        
        if (awardsId) {
          const contentExists = await AwardsData.findOne({ where: [ {id: { [Op.ne]: id }},{is_deleted: DeletedStaus.InDeleted}] });
          
          if (contentExists != null) {

            let bannerInfo;
            if(idImage) {
              
               bannerInfo = await (AwardsData.update(
                {
                  title: title,
                  year: year,
                  modified_date: getLocalDate(),
                  modified_by: req.body.session_res.id_app_user,
                  image_id: idImage
                },
                { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
              ));
            } else {
              bannerInfo = await (AwardsData.update(
                {
                    title: title,
                    year: year,
                    modified_date: getLocalDate(),
                    modified_by: req.body.session_res.id_app_user,
                },
                { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
              ));
            }
            if (bannerInfo) {
                const bannerInformation = await AwardsData.findOne({ where: [ {id: id },{is_deleted: DeletedStaus.InDeleted}] });

              await trn.commit()
              return resSuccess({data: bannerInformation})
            }
          } else {
            await trn.rollback()
            return resNotFound()
          }
        }else {
            return resNotFound() 
        }
  
        await trn.commit()
    
    } catch (error) {
        await trn.rollback()
        throw(error);
    }

}
export const deleteAward = async (req: Request) => {

    try {
        const awardsExists = await AwardsData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

          if (!(awardsExists && awardsExists.dataValues)) {
            return resNotFound();
          }
          await AwardsData.update(
            {
              is_deleted: "1",
              modified_by: req.body.session_res.id_app_user,
              modified_date: getLocalDate(),
            },
            { where: { id: awardsExists.dataValues.id } }
          );
      
          return resSuccess({message: RECORD_DELETE_SUCCESSFULLY});
    } catch (error) {
        throw error
    }
}
export const statusUpdateAward = async (req: Request) => {
    try {
        const awardsExists = await AwardsData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
        if (awardsExists) {
            const ActionInfo = await (AwardsData.update(
                {
                    status: req.body.is_active,
                    modified_date: getLocalDate(),
                    modified_by: req.body.session_res.id_app_user
                },
                { where: { id: awardsExists.dataValues.id } }
            ));
            if (ActionInfo) {
                return resSuccess({message: RECORD_UPDATE_SUCCESSFULLY})
            } 
        } else {
            return resNotFound();
        }
    } catch (error) {
        throw error
    }
}
///////////////////// WhyUs Features /////////////////////

export const addWhyUsFeatures = async (req: Request) => {
    const { title, description} = req.body
    const trn = await dbContext.transaction();
    
    try {
      var files = req.files as any;
      let image = files.image[0];
      let icon = files.icon[0];
      let idImage = null
      let idicon = null

      if (image) {
        const moveFileResult = await moveFileToFps(
          image
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
        if (icon) {
          const moveFileResult = await moveFileToFps(
            icon
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
    
          idicon = imageResult.dataValues.id;
      }

        const payload = {
            title: title,
            description: description,
            icon_id:idicon,
            created_date: getLocalDate(),
            is_deleted: DeletedStaus.InDeleted,
            created_by: req.body.session_res.id_app_user,
            status: ActiveStatus.Active,
            image_id: idImage
        } 

        await WhyUsFeaturesData.create(payload, {transaction: trn})
        await trn.commit()
        return resSuccess({data: payload});
    } catch (error) {
        await trn.rollback()
        throw (error)
    }
}
export const getAllWhyUsFeatures = async (req: Request) => {
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
              { title: { [Op.iLike]: "%" + pagination.search_text  + "%" } },
              { description: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
            }
          : {},
      ];
  
      if (!noPagination) {
        const totalItems = await WhyUsFeaturesData.count({
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
  
      const result = await WhyUsFeaturesData.findAll({
        ...paginationProps,
        where,
        order: [[pagination.sort_by, pagination.order_by]],
        include: [
          { model: Image, as: "image", attributes: [] },
          { model: Image, as: "icon", attributes: [] },
        ],
        attributes: [
          "id",
          "title",
          "description",
          // "icon",
          "created_date",
          "modified_date",
          "is_deleted",
          "created_by",
          "modified_by",
          "status",
          [Sequelize.literal("image.image_path"), "image_path"],
          [Sequelize.literal("image.id"), "image_id"],
          [Sequelize.literal("icon.image_path"), "icon_image_path"],
          [Sequelize.literal("icon.id"), "icon_image_id"],
        ],
      });
  
      return resSuccess({ data: noPagination ? result : { pagination, result } });
    } catch (error) {
      throw error;
    }
}
export const getWhyUsFeatures = async (req: Request) => {
    try {
      let paginationProps = {};
  
      let pagination = {
        ...getInitialPaginationFromQuery(req.query),
        search_text: req.query.search_text,
      };
      let noPagination = req.query.no_pagination === "1";
  
      let where = [
        {status : ActiveStatus.Active},
        { is_deleted: DeletedStaus.InDeleted },
        pagination.is_active ? { status: pagination.is_active } : {},
        pagination.search_text
          ? {
            [Op.or]: [
              { content: { [Op.iLike]: "%" + pagination.search_text  + "%" } },
              { link: { [Op.iLike]: "%" + pagination.search_text + "%" } },
          ],
            }
          : {},
      ];
  
      if (!noPagination) {
        const totalItems = await WhyUsFeaturesData.count({
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
  
      const result = await WhyUsFeaturesData.findAll({
        ...paginationProps,
        where,
        order: [[pagination.sort_by, pagination.order_by]],
        include: [
          { model: Image, as: "image", attributes: [] },
        ],
        attributes: [
            "id",
            "title",
            "description",
            "icon",
            "created_date",
          [Sequelize.literal("image.image_path"), "image_path"],
        ],
      });
  
      return resSuccess({ data: noPagination ? result : { pagination, result } });
    } catch (error) {
      throw error;
    }
}
export const getByIdWhyUsFeatures = async (req: Request) => {
    try {
        console.log(req.params.id);
        const banner = await WhyUsFeaturesData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });
    
        if (!(banner && banner.dataValues)) {
            return resNotFound();
          }
          return resSuccess({data: banner})
    } catch (error) {
        throw error
    }
}
export const updateWhyUsFeatures = async (req: Request) => {
    const { id,title, description} = req.body
    const trn = await dbContext.transaction();

    try { 
      var files = req.files as any;
      let image = files.image;
      let icon = files.icon;
      let idImage = null
      let idicon = null

      if (image) {
        const moveFileResult = await moveFileToFps(
          image[0]
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
        if (icon) {
          const moveFileResult = await moveFileToFps(
            icon[0]
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
    
          idicon = imageResult.dataValues.id;
      }

        const awardsId = await WhyUsFeaturesData.findOne({ where: [ {id: id },{is_deleted: DeletedStaus.InDeleted}] });
        
        if (awardsId) {
          const contentExists = await WhyUsFeaturesData.findOne({ where: [ {id: { [Op.ne]: id }},{is_deleted: DeletedStaus.InDeleted}] });
          
          if (contentExists != null) {

            let bannerInfo;
            if(idImage && idicon) {
              
               bannerInfo = await (WhyUsFeaturesData.update(
                {
                  title: title,
                  description: description,
                  icon_id:idicon,
                  modified_date: getLocalDate(),
                  modified_by: req.body.session_res.id_app_user,
                  image_id: idImage
                },
                { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
              ));
            } else {
              bannerInfo = await (WhyUsFeaturesData.update(
                {
                    title: title,
                    description: description,
                    modified_date: getLocalDate(),
                    modified_by: req.body.session_res.id_app_user,
                },
                { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
              ));
            }
            if (bannerInfo) {
                const information = await WhyUsFeaturesData.findOne({ where: [ {id: id },{is_deleted: DeletedStaus.InDeleted}] });

              await trn.commit()
              return resSuccess({data: information})
            }
          } else {
            await trn.rollback()
            return resNotFound()
          }
        }else {
            return resNotFound() 
        }
  
        await trn.commit()
    
    } catch (error) {
        await trn.rollback()
        throw(error);
    }

}
export const deleteWhyUsFeatures = async (req: Request) => {

    try {
        const featuresExists = await WhyUsFeaturesData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

          if (!(featuresExists && featuresExists.dataValues)) {
            return resNotFound();
          }
          await WhyUsFeaturesData.update(
            {
              is_deleted: "1",
              modified_by: req.body.session_res.id_app_user,
              modified_date: getLocalDate(),
            },
            { where: { id: featuresExists.dataValues.id } }
          );
      
          return resSuccess({message: RECORD_DELETE_SUCCESSFULLY});
    } catch (error) {
        throw error
    }
}
export const statusUpdateWhyUsFeatures = async (req: Request) => {
    try {
        const featuresExists = await WhyUsFeaturesData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
        if (featuresExists) {
            const ActionInfo = await (WhyUsFeaturesData.update(
                {
                    status: req.body.is_active,
                    modified_date: getLocalDate(),
                    modified_by: req.body.session_res.id_app_user
                },
                { where: { id: featuresExists.dataValues.id } }
            ));
            if (ActionInfo) {
                return resSuccess({message: RECORD_UPDATE_SUCCESSFULLY})
            } 
        } else {
            return resNotFound();
        }
    } catch (error) {
        throw error
    }
}