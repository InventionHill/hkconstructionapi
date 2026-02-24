import { Request } from "express";
import { Op, Sequelize, Transaction } from "sequelize";
import dbContext from "../config/db-context";
import { moveFileToFps } from "../helpers/file.helper";
import { ActiveStatus, CareerStatus, DeletedStaus, IMAGE_TYPE } from "../utils/app-enumeration";
import { DEFAULT_STATUS_CODE_SUCCESS, RECORD_DELETE_SUCCESSFULLY, RECORD_UPDATE_SUCCESSFULLY, RESUME_FILE_NOT_FOUND } from "../utils/app-messages";
import Image from "../model/image.model";
import { columnValueLowerCase, getInitialPaginationFromQuery, getLocalDate, resBadRequest, resErrorDataExit, resNotFound, resSuccess } from "../utils/shared-functions";
import CareerData from "../model/career.model";
import CareerReqData from "../model/careerReqData.model";

////////////////////// Career requirements add //////////////////////

export const addCareer = async (req: Request) => {
    const { designation,description,requirement } = req.body
    
    try {
  
      const payload = {
        designation: designation,
        description: description,
        requirement: requirement,
        created_date: getLocalDate(),
        is_deleted: DeletedStaus.InDeleted,
        created_by: req.body.session_res.id_app_user,
        status: ActiveStatus.Active,
      }
  
      await CareerData.create(payload)
      return resSuccess({ data: payload });

    } catch (error) {
      throw (error)
    }
  }
  
export const getAllCareer = async (req: Request) => {
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
              { requirement: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { designation: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { description: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            ],
          }
          : {},
      ];
  
      if (!noPagination) {
        const totalItems = await CareerData.count({
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
  
      const result = await CareerData.findAll({
        ...paginationProps,
        where,
        order: [[pagination.sort_by, pagination.order_by]],
        attributes: [
          "id",
          "designation",
          "description",
          "requirement",
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
  export const getCareer = async (req: Request) => {
    try {
  
      let where = [
        { is_deleted: DeletedStaus.InDeleted },
        { status: ActiveStatus.Active },
      ];

      const result = await CareerData.findAll({
        where,
        attributes: [
          "id",
          "designation",
          "description",
          "requirement",
          "created_date",
          "modified_date",
          "status"
        ],
      });
  
      return resSuccess({ data: result });
    } catch (error) {
      throw error;
    }
  }
export const getByIdCareer = async (req: Request) => {
    try {
      console.log(req.params.id);
      const builder = await CareerData.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });
  
      if (!(builder && builder.dataValues)) {
        return resNotFound();
      }
      return resSuccess({ data: builder })
    } catch (error) {
      throw error
    }
  }  
  
export const updateCareer = async (req: Request) => {
    const { id,designation,description,requirement } = req.body
    try {

      const builderId = await CareerData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });
  
      if (builderId) {
          let builderInfo;
       
            builderInfo = await (CareerData.update(
              {
                  designation: designation,
                  description: description,
                  requirement: requirement,
                  modified_date: getLocalDate(),
                modified_by: req.body.session_res.id_app_user,
              },
              { where: { id: id, is_deleted: DeletedStaus.InDeleted }}
            ));

          if (builderInfo) {
            const builderInformation = await CareerData.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });

            return resSuccess({ data: builderInformation })
          }
        }else{
          return resNotFound()
      }
    } catch (error) {
      
      throw (error);
    }
  }
   
export const deleteCareer = async (req: Request) => {
  
    try {
      const CareerDataExists = await CareerData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
  
      if (!(CareerDataExists && CareerDataExists.dataValues)) {
        return resNotFound();
      }
      await CareerData.update(
        {
          is_deleted: "1",
          modified_by: req.body.session_res.id_app_user,
          modified_date: getLocalDate(),
        },
        { where: { id: CareerDataExists.dataValues.id } }
      );
  
      return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
    } catch (error) {
      throw error
    }
  }
   
export const statusUpdateCareer = async (req: Request) => {
    try {
      const builderExists = await CareerData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
      if (builderExists) {
        const builderActionInfo = await (CareerData.update(
          {
            status: req.body.is_active,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user
          },
          { where: { id: builderExists.dataValues.id } }
        ));
        if (builderActionInfo) {
          return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
        }
      } else {
        return resNotFound();
      }
    } catch (error) {
      throw error
    }
  }

  ////////////////////// Career request sent //////////////////////

  
export const addCareerReq = async (req: Request) => {
    const { first_name,last_name,email,phone,career_id,city,state,experience } = req.body      
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
            image_type: IMAGE_TYPE.Builder,
            created_by: req.body.session_res.id_app_user,
            created_date: getLocalDate(),
          },
          { transaction: trn }
        );
  
        idImage = imageResult.dataValues.id;
      }else{
        return resBadRequest({message:RESUME_FILE_NOT_FOUND})
      }
      const payload = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        city:city,
        state:state,
        experience:experience,
        career_id: career_id,
        created_date: getLocalDate(),
        is_deleted: DeletedStaus.InDeleted,
        created_by: req.body.session_res.id_app_user,
        status: CareerStatus.Pending,
        image_id:idImage
      }
  
      await CareerReqData.create(payload)
      await trn.commit();
      return resSuccess({ data: payload });

    } catch (error) {     
      await trn.rollback();
      throw (error)
    }
  }
  export const getByIdCareerReq = async (req: Request) => {
    try {
      
      let where = [
        {id : req.params.id},
        { is_deleted: DeletedStaus.InDeleted }
      ];
  
      const result = await CareerReqData.findOne({
        where,
        include: [
            { model: Image, as: "image", attributes: [] },
            { model: CareerData, as: "careers", attributes: []},
          ],
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "phone",
          "experience",
          "city",
          "state",
          "modified_date",
          "status",
          [Sequelize.literal("image.image_path"), "resume_path"],
          [Sequelize.literal("image.id"), "resume_id"],
          [Sequelize.literal("careers.designation"), "designation"],
          [Sequelize.literal("careers.id"), "career_id"],
        ],
      });
  
      return resSuccess({ data:  result  });
    } catch (error) {
      throw error;
    }
  }  
export const getAllCareerReq = async (req: Request) => {
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
              { first_name: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { last_name: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { email: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { phone: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { city: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { state: { [Op.iLike]: "%" + pagination.search_text + "%" } },
              { experience : { [Op.iLike]: "%" + pagination.search_text + "%" } },
            ],
          }
          : {},
      ];
  
      if (!noPagination) {
        const totalItems = await CareerReqData.count({
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
  
      const result = await CareerReqData.findAll({
        ...paginationProps,
        where,
        order: [[pagination.sort_by, pagination.order_by]],
        include: [
            { model: Image, as: "image", attributes: [] },
            { model: CareerData, as: "careers", attributes: [] , where:[
                pagination.search_text
          ? {
            [Op.or]: [
              { designation: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            ],
          }
          : {},
        ]},
          ],
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "phone",
          "experience",
          "city",
          "state",
          "modified_date",
          "status",
          [Sequelize.literal("image.image_path"), "resume_path"],
          [Sequelize.literal("image.id"), "resume_id"],
          [Sequelize.literal("careers.designation"), "designation"],
          [Sequelize.literal("careers.id"), "career_id"],
        ],
      });
  
      return resSuccess({ data: noPagination ? result : { pagination, result } });
    } catch (error) {
      throw error;
    }
  }
  export const deleteCareerReq = async (req: Request) => {
  
    try {
      const CareerDataExists = await CareerReqData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
  
      if (!(CareerDataExists && CareerDataExists.dataValues)) {
        return resNotFound();
      }
      await CareerReqData.update(
        {
          is_deleted: "1",
          modified_by: req.body.session_res.id_app_user,
          modified_date: getLocalDate(),
        },
        { where: { id: CareerDataExists.dataValues.id } }
      );
  
      return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
    } catch (error) {
      throw error
    }
  }
   
export const statusUpdateCareerReq = async (req: Request) => {
    try {
      const builderExists = await CareerReqData.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
      if (builderExists) {
        const builderActionInfo = await (CareerReqData.update(
          {
            status: req.body.is_active,
            modified_date: getLocalDate(),
            modified_by: req.body.session_res.id_app_user
          },
          { where: { id: builderExists.dataValues.id } }
        ));
        if (builderActionInfo) {
          return resSuccess({ message: RECORD_UPDATE_SUCCESSFULLY })
        }
      } else {
        return resNotFound();
      }
    } catch (error) {
      throw error
    }
  }
