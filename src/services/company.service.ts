import { Request } from "express";
import { ActiveStatus, Attribute, DeletedStaus, IMAGE_TYPE } from "../utils/app-enumeration";
import { DEFAULT_STATUS_CODE_SUCCESS, RECORD_DELETE_SUCCESSFULLY, RECORD_UPDATE_SUCCESSFULLY } from "../utils/app-messages";
import { getInitialPaginationFromQuery, getLocalDate, resErrorDataExit, resNotFound, resSuccess, columnValueLowerCase } from "../utils/shared-functions";
// import { moveFileToS3ByType } from "../../../helpers/file.helper";
import Image from "../model/image.model";
import dbContext from "../config/db-context";
import { moveFileToFps } from "../helpers/file.helper";
import CompanyCountInfoModel from "../model/CompanyCountInfo.model";
import { Op, Sequelize } from "sequelize";
import CompanyInfo from "../model/companyinfo.model";
import FeaturesData from "../model/features.model";
import { ArchiveStatus } from "@aws-sdk/client-s3";

export const addCompanyCountInfo = async (req: Request) => {
      try {
        const { title, count ,description} = req.body
        const payload = {
          title:title,
          count: count,
          description:description,
          created_date: getLocalDate(),
          is_deleted: DeletedStaus.InDeleted,
          status:1,
          created_by: req.body.session_res.id_app_user,
        }
        await CompanyCountInfoModel.create(payload)
        return resSuccess({ data: payload });

    } catch (error) {
      throw (error)
    }
  }

export const getAllCompanyCountInfo = async (req: Request) => {
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
            { description: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            Sequelize.literal(`CAST("count" AS TEXT) ILIKE '%' || '${pagination.search_text}' || '%'`),
          ],
        }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await CompanyCountInfoModel.count({
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

    const result = await CompanyCountInfoModel.findAll({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      attributes: [
        "id",
        "title",
        "description",
        "created_date",
        "count",
        "modified_date",
        "status"
        ],
    });

    return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
  }
  export const CountCompanyInfo = async (req: Request) => {
    try {
     let where = [
       { is_deleted: DeletedStaus.InDeleted },
       { status: ActiveStatus.Active },
     ];
 
     const result = await CompanyCountInfoModel.findAll({
       where,
       attributes: [
         "id",
         "title",
         "description",
         "created_date",    
         "count"   
         ],
     });
 
     return resSuccess({ data: result });
   } catch (error) {
     throw error;
   }
  }
export const getByIdCompanyCountInfo = async (req: Request) => {
    try {
      console.log(req.params.id);
      const count = await CompanyCountInfoModel.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });
  
      if (!(count && count.dataValues)) {
        return resNotFound();
      }
      return resSuccess({ data: count })
    } catch (error) {
      throw error
    }
  }
export const updateCompanyCountInfo = async (req: Request) => {
  try {
    const { id,title, count ,description} = req.body  

    const companyCountInfo = await CompanyCountInfoModel.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

    if (companyCountInfo) { 
      let companyCount; 
      companyCount = await (CompanyCountInfoModel.update(
        {
          title: title,
          count:count,
          description: description,
          modified_date: getLocalDate(),
          modified_by: req.body.session_res.id_app_user,
        },
        { where: { id: id, is_deleted: DeletedStaus.InDeleted }}
      ));
      const shapesInformation = await CompanyCountInfoModel.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

      return resSuccess({ data: shapesInformation })

    } else {
      return resNotFound()
    }

  } catch (error) {
    throw (error);
  }
  } 
export const deleteCompanyCountInfo = async (req: Request) => {

    try {
      const companyCountInfo = await CompanyCountInfoModel.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
  
      if (!(companyCountInfo && companyCountInfo.dataValues)) {
        return resNotFound();
      }
      await CompanyCountInfoModel.update(
        {
          is_deleted: "1",
          modified_by: req.body.session_res.id_app_user,
          modified_date: getLocalDate(),
        },
        { where: { id: companyCountInfo.dataValues.id } }
      );
  
      return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
    } catch (error) {
      throw error
    }
  } 
  export const statusUpdateCompanyCountInfo = async (req: Request) => {
    try {
      const companyCountInfo = await CompanyCountInfoModel.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

      if (!(companyCountInfo && companyCountInfo.dataValues)) {
        return resNotFound();
      }

      const companyCountActionInfo = await (CompanyCountInfoModel.update(
        {
          status: req.body.is_active,
          modified_date: getLocalDate(),
          modified_by: req.body.session_res.id_app_user
        },
        { where: { id: companyCountInfo.dataValues.id } }
      ));
      if (companyCountActionInfo) {
        return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
      }
    } catch (error) {
      throw error
    }
  }

  ////////////////////// Company info //////////////////////

  export const addCompanyInfo = async (req: Request) => {
    try {
      const { company_name,company_email, company_phone ,brochure_name,brochure_links,address,sort_description,copyright,office_time,map_link,web_link,facebook_link,insta_link,youtube_link,linkdln_link,twitter_link,mission,vision,about_company,owner_description,welcome_text} = req.body

      const trn = await dbContext.transaction();

      var files = req.files as any;
      let logoWhite = files.logo_white;
      let logoBlack = files.logo_black;
      let ownerImage = files.owner_image;
      let aboutImage = files.about_image;
      let smlogoImage = files.sm_logo;
      let brochureFile = files.brochure;
  
      let idlogoWhite = null
      let idlogoBlack = null
      let idownerImage = null
      let idaboutImage = null
      let idsmlogoImage = null
      let idbrochureFile = null
      if (logoWhite) {
        const moveFileResult = await moveFileToFps(
          logoWhite[0]
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
  
        idlogoWhite = imageResult.dataValues.id;  
      }
      if (logoBlack) {
        const moveFileResult = await moveFileToFps(
          logoBlack[0]
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
  
        logoBlack = imageResult.dataValues.id;  
      }
      if (ownerImage) {
        const moveFileResult = await moveFileToFps(
          ownerImage[0]
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
  
        idownerImage = imageResult.dataValues.id;  
      }
      if (aboutImage) {
        const moveFileResult = await moveFileToFps(
          ownerImage[0]
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
  
        idaboutImage = imageResult.dataValues.id;  
      }
      if (smlogoImage) {
        const moveFileResult = await moveFileToFps(
          smlogoImage[0]
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
  
        idsmlogoImage = imageResult.dataValues.id;  
      }
      if (brochureFile) {
        const moveFileResult = await moveFileToFps(
          brochureFile[0]
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
  
        brochureFile = imageResult.dataValues.id;  
      }
      const payload = {
        company_name:company_name,
        company_email: company_email,
        company_phone:company_phone,
        brochure_name:brochure_name,
        brochure_links:brochure_links,
        address:address,
        sort_description:sort_description,
        copyright:copyright,
        office_time:office_time,
        map_link:map_link,
        web_link:web_link,
        facebook_link:facebook_link,
        about_company:about_company,
        vision:vision,
        mission:mission,
        insta_link:insta_link,
        youtube_link:youtube_link,
        linkdln_link:linkdln_link,
        twitter_link:twitter_link,
        created_date: getLocalDate(),
        is_deleted: DeletedStaus.InDeleted,
        status:1,
        created_by: req.body.session_res.id_app_user,
        logo_white:idlogoWhite,
        logo_black:idlogoBlack,
        owner_image:idownerImage,
        owner_description:owner_description,
        welcome_text:welcome_text,
        sm_logo:idsmlogoImage,
        about_image_id:idaboutImage,
        brochure_file_id:idbrochureFile,
      }
      
      await CompanyInfo.create(payload)
      return resSuccess({ data: payload });

  } catch (error) {
    throw (error)
  }
}

export const getAllCompanyInfo = async (req: Request) => {
 try {

  let where = [
    { is_deleted: DeletedStaus.InDeleted },
    ];

  const result = await CompanyInfo.findOne({
    where,
    attributes: [
      "id",
      "company_name",
      "company_email",
      "company_phone",
      "brochure_name",
      // "brochure_links",
      "address",
      "sort_description",
      "vision",
      "mission",
      "about_company",
      "copyright",
      "office_time",
      "map_link",
      "web_link",
      "facebook_link",
      "insta_link",
      "youtube_link",
      "linkdln_link",
      "twitter_link",
      "created_date",
      "modified_date",
      "status",
      "owner_description",
      "welcome_text",
      [Sequelize.literal("logo_white_image.image_path"), "logo_white_image_path"],
      [Sequelize.literal("logo_white_image.id"), "logo_white_image_id"],
      [Sequelize.literal("logo_black_image.image_path"), "logo_black_image_path"],
      [Sequelize.literal("logo_black_image.id"), "logo_black_image_id"],
      [Sequelize.literal("owner_image.image_path"), "owner_image_path"],
      [Sequelize.literal("owner_image.id"), "owner_image_id"],
      [Sequelize.literal("about_image.image_path"), "about_image_path"],
      [Sequelize.literal("about_image.id"), "about_image_id"],
      [Sequelize.literal("sm_logo_image.image_path"), "sm_logo_image_path"],
      [Sequelize.literal("sm_logo_image.id"), "sm_logo_image_id"],
      [Sequelize.literal("brochure.image_path"), "brochure_path"],
      [Sequelize.literal("brochure.id"), "brochure_id"]

    ],
      include: [
        { model: Image, as: "logo_white_image", attributes: [] },
        { model: Image, as: "logo_black_image", attributes: [] },
        { model: Image, as: "owner_image", attributes: [] },
        { model: Image, as: "about_image", attributes: [] },
        { model: Image, as: "sm_logo_image", attributes: [] },
        { model: Image, as: "brochure", attributes: [] }
      ],
  });

  return resSuccess({ data: result });
} catch (error) {
  throw error;
}
}

 export const getCompanyInfo = async (req: Request) => {
  try {

    let where = [
      { is_deleted: DeletedStaus.InDeleted },
      ];
  
    const result = await CompanyInfo.findOne({
      where,
      attributes: [
        "id",
        "company_name",
        "company_email",
        "company_phone",
        "brochure_name",
        "brochure_links",
        "address",
        "sort_description",
        "vision",
        "mission",
        "about_company",
        "copyright",
        "office_time",
        "map_link",
        "web_link",
        "facebook_link",
        "insta_link",
        "youtube_link",
        "linkdln_link",
        "twitter_link",
        "created_date",
        "owner_description",
        "welcome_text",
        [Sequelize.literal("logo_white_image.image_path"), "logo_white_image_path"],
        [Sequelize.literal("logo_white_image.id"), "logo_white_image_id"],
        [Sequelize.literal("logo_black_image.image_path"), "logo_black_image_path"],
        [Sequelize.literal("logo_black_image.id"), "logo_black_image_id"],
        [Sequelize.literal("owner_image.image_path"), "owner_image_path"],
        [Sequelize.literal("owner_image.id"), "owner_image_id"],
        [Sequelize.literal("about_image.image_path"), "about_image_path"],
        [Sequelize.literal("about_image.id"), "about_image_id"],
        [Sequelize.literal("sm_logo_image.image_path"), "sm_logo_image_path"],
        [Sequelize.literal("sm_logo_image.id"), "sm_logo_image_id"],
        [Sequelize.literal("brochure.image_path"), "brochure_path"],
        [Sequelize.literal("brochure.id"), "brochure_id"]  
      ],
        include: [
          { model: Image, as: "logo_white_image", attributes: [] },
          { model: Image, as: "logo_black_image", attributes: [] },
          { model: Image, as: "owner_image", attributes: [] },            
        { model: Image, as: "about_image", attributes: [] },
        { model: Image, as: "sm_logo_image", attributes: [] },
        { model: Image, as: "brochure", attributes: [] }

          ],  
    });
  
    return resSuccess({ data: result });
  } catch (error) {
    throw error;
  }
}

export const getByIdCompanyInfo = async (req: Request) => {
  try {
    const count = await CompanyInfo.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(count && count.dataValues)) {
      return resNotFound();
    }
    return resSuccess({ data: count })
  } catch (error) {
    throw error
  }
}

export const updateCompanyInfo = async (req: Request) => {  
  const trn = await dbContext.transaction();
  try {
  const { id,company_name,company_email, company_phone ,brochure_name,brochure_links,address,sort_description,copyright,office_time,map_link,web_link,facebook_link,insta_link,youtube_link,linkdln_link,twitter_link,mission,vision,about_company,owner_description,welcome_text} = req.body
  var files = req.files as any;
  let logoWhite = files.logo_white;
  let logoBlack = files.logo_black;
  let ownerImage = files.owner_image;
  let aboutImage = files.about_image;
  let smlogoImage = files.sm_logo;
  let brochureFile = files.brochure;
  
  let idlogoWhite = null
  let idlogoBlack = null
  let idownerImage = null
  let idaboutImage = null
  let idsmlogoImage = null
  let idbrochureFile = null
if (logoWhite) {
    const moveFileResult = await moveFileToFps(
      logoWhite[0]
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

    idlogoWhite = imageResult.dataValues.id;  
  }
  if (logoBlack) {
    const moveFileResult = await moveFileToFps(
      logoBlack[0]
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

    idlogoBlack = imageResult.dataValues.id;  
  }
  if (ownerImage) {
    const moveFileResult = await moveFileToFps(
      ownerImage[0]
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

    idownerImage = imageResult.dataValues.id;  
  }
  if (aboutImage) {
    const moveFileResult = await moveFileToFps(
      aboutImage[0]
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

    idaboutImage = imageResult.dataValues.id;  
  }
  if (smlogoImage) {
    
    const moveFileResult = await moveFileToFps(
      smlogoImage[0]
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

    idsmlogoImage = imageResult.dataValues.id;  
  }
  if (brochureFile) {
    const moveFileResult = await moveFileToFps(
      brochureFile[0]
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

    idbrochureFile = imageResult.dataValues.id;  
  }
    const companyCountInfo = await CompanyInfo.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

  if (companyCountInfo) { 
    let companyCount; 
    companyCount = await CompanyInfo.update(
      {
        company_name: company_name,
        company_email: company_email,
        company_phone: company_phone,
        brochure_name: brochure_name,
        brochure_links: brochure_links,
        address: address,
        sort_description: sort_description,
        copyright: copyright,
        office_time: office_time,
        map_link: map_link,
        web_link: web_link,
        facebook_link: facebook_link,
        about_company: about_company,
        vision: vision,
        mission: mission,
        insta_link: insta_link,
        youtube_link: youtube_link,
        linkdln_link: linkdln_link,
        twitter_link: twitter_link,
        ...(idlogoWhite != null && { logo_white: idlogoWhite }), // Corrected if condition
        ...(idlogoBlack != null && { logo_black: idlogoBlack }), // Corrected if condition
        ...(idownerImage != null && { owner_image_id: idownerImage }), // Corrected if condition
        owner_description: owner_description,
        modified_date: getLocalDate(),
        modified_by: req.body.session_res.id_app_user,
        welcome_text: welcome_text,
        ...(idsmlogoImage != null && { sm_logo: idsmlogoImage }), // Corrected if condition
        ...(idaboutImage != null && { about_image_id: idaboutImage }), // Corrected if condition
        ...(idbrochureFile != null && { brochure_file_id: idbrochureFile }), // Corrected if condition
      },
      { where: { id: id, is_deleted: DeletedStaus.InDeleted }}
    );
    
    const shapesInformation = await CompanyInfo.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });
    await trn.commit()
    return resSuccess({ data: shapesInformation })

  } else {
    return resNotFound()
  }
  await trn.commit()

} catch (error) {
  await trn.commit()
  throw (error);
}
} 

export const deleteCompanyInfo = async (req: Request) => {

  try {
    const companyCountInfo = await CompanyInfo.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(companyCountInfo && companyCountInfo.dataValues)) {
      return resNotFound();
    }
    await CompanyInfo.update(
      {
        is_deleted: "1",
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: companyCountInfo.dataValues.id } }
    );

    return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
  } catch (error) {
    throw error
  }
} 

export const statusUpdateCompanyInfo = async (req: Request) => {
  try {
    const companyCountInfo = await CompanyInfo.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

    if (!(companyCountInfo && companyCountInfo.dataValues)) {
      return resNotFound();
    }

    const companyCountActionInfo = await (CompanyInfo.update(
      {
        status: req.body.is_active,
        modified_date: getLocalDate(),
        modified_by: req.body.session_res.id_app_user
      },
      { where: { id: companyCountInfo.dataValues.id } }
    ));
    if (companyCountActionInfo) {
      return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
    }
  } catch (error) {
    throw error
  }
} 


//////////////////////// features branch ////////////////////////////

export const addFeatures = async (req: Request) => {
  try {
    const { title} = req.body

    const trn = await dbContext.transaction();

    let idimage = null
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

      idimage = imageResult.dataValues.id;  
    }

    const payload = {
      title:title,
      created_date: getLocalDate(),
      is_deleted: DeletedStaus.InDeleted,
      status:1,
      created_by: req.body.session_res.id_app_user,
      image_id:idimage
    }
    
    await FeaturesData.create(payload)
    await trn.commit()

    return resSuccess({ data: payload });

} catch (error) {
  throw (error)
}
}

export const getAllFeatures = async (req: Request) => {
try {

let where = [
  { is_deleted: DeletedStaus.InDeleted },
  {status : ActiveStatus.Active}
  ];

const result = await FeaturesData.findAll({
  where,
  attributes: [
    "id",
    "title",
    "created_date",
    "modified_date",
    "status",
    [Sequelize.literal("image.image_path"), "image_path"],
    [Sequelize.literal("image.id"), "image_id"]
  ],
    include: [
      { model: Image, as: "image", attributes: [] }
    ],
});

return resSuccess({ data: result });
} catch (error) {
throw error;
}
}

// export const getFeatures = async (req: Request) => {
//   try {
//     let paginationProps = {};
  
//       let pagination = {
//         ...getInitialPaginationFromQuery(req.query),
//         search_text: req.query.search_text,
//       };
//       let noPagination = req.query.no_pagination === "1";
  
//       let where = [
//         { is_deleted: DeletedStaus.InDeleted },
//         pagination.is_active ? { status: pagination.is_active } : {},
//         pagination.search_text
//           ? {
//             [Op.or]: [
//               { title: { [Op.iLike]: "%" + pagination.search_text  + "%" } },
//           ],
//             }
//           : {},
//       ];

//     if (!noPagination) {
//       const totalItems = await FeaturesData.count({
//         ...paginationProps,
//         where,
//       });
//       if (totalItems === 0) {
//     return resSuccess({ data: { pagination, result: [] } });   

//   }
//   pagination.total_items = totalItems;
//   pagination.total_pages = Math.ceil(totalItems / pagination.per_page_rows);

//   paginationProps = {
//     limit: pagination.per_page_rows,
//     offset: (pagination.current_page - 1) * pagination.per_page_rows,
//   };
//     }  
//     // let where = [
//     //   { is_deleted: DeletedStaus.InDeleted },
//     //   ];
    
//     const result = await FeaturesData.findAll({
//       ...paginationProps,
//       where,
//       attributes: [
//         "id",
//         "title",
//         "created_date",
//         "modified_date",
//         "status",
//         [Sequelize.literal("image.image_path"), "image_path"],
//         [Sequelize.literal("image.id"), "image_id"]
//       ],
//         include: [
//           { model: Image, as: "image", attributes: [] }
//         ],
//     });
    
//     return resSuccess({ data: noPagination ? result : { pagination, result } });
//     } catch (error) {
//     throw error;
//     }
// }
export const getFeatures = async (req: Request) => {
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
            { title: { [Op.iLike]: "%" + pagination.search_text  + "%" } }
        ],
          }
        : {},
    ];

    if (!noPagination) {
      const totalItems = await FeaturesData.count({
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

    const result = await FeaturesData.findAll({
      ...paginationProps,
      where,
      order: [[pagination.sort_by, pagination.order_by]],
      include: [
        { model: Image, as: "image", attributes: [] },
      ],
      attributes: [
        "id",
        "title",
        "created_date",
        "modified_date",
        "status",
        [Sequelize.literal("image.image_path"), "image_path"],
        [Sequelize.literal("image.id"), "image_id"]
      ]
});

      return resSuccess({ data: noPagination ? result : { pagination, result } });
  } catch (error) {
    throw error;
  }
}

export const getByIdFeatures = async (req: Request) => {
try {
  const count = await FeaturesData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });

  if (!(count && count.dataValues)) {
    return resNotFound();
  }
  return resSuccess({ data: count })
} catch (error) {
  throw error
}
}

export const updateFeatures = async (req: Request) => {  
const trn = await dbContext.transaction();
try {
  const { id,title} = req.body

  let idimage = null
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

    idimage = imageResult.dataValues.id;  
  }
const companyCountInfo = await FeaturesData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

if (companyCountInfo) { 
  let companyCount; 
  if (idimage) {
    companyCount = await (FeaturesData.update(
      {
        title:title,
        image_id:idimage,
        modified_date: getLocalDate(),
        modified_by: req.body.session_res.id_app_user,
      },
      { where: { id: id, is_deleted: DeletedStaus.InDeleted }}
    ));    
  }else{
    companyCount = await (FeaturesData.update(
      {
        title:title,
        modified_by: req.body.session_res.id_app_user,
        modified_date: getLocalDate(),
      },
      { where: { id: id, is_deleted: DeletedStaus.InDeleted }}
    ));    
  }
  // const shapesInformation = await FeaturesData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });
  await trn.commit()
  return resSuccess()

} else {
  await trn.rollback();
  return resNotFound()
}

} catch (error) {
  await trn.rollback();
throw (error);
}
} 

export const deleteFeatures = async (req: Request) => {

try {
  const companyCountInfo = await FeaturesData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

  if (!(companyCountInfo && companyCountInfo.dataValues)) {
    return resNotFound();
  }
  await FeaturesData.update(
    {
      is_deleted: "1",
      modified_by: req.body.session_res.id_app_user,
      modified_date: getLocalDate(),
    },
    { where: { id: companyCountInfo.dataValues.id } }
  );

  return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
} catch (error) {
  throw error
}
} 

export const statusUpdateFeatures = async (req: Request) => {
try {
  const companyCountInfo = await FeaturesData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });

  if (!(companyCountInfo && companyCountInfo.dataValues)) {
    return resNotFound();
  }

  const companyCountActionInfo = await (FeaturesData.update(
    {
      status: req.body.is_active,
      modified_date: getLocalDate(),
      modified_by: req.body.session_res.id_app_user
    },
    { where: { id: req.body.id } }
  ));
  if (companyCountActionInfo) {
    return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
  }
} catch (error) {
  throw error
}
} 