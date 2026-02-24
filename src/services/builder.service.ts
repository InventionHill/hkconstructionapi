import { Request } from "express";
import { Op, Sequelize } from "sequelize";
import dbContext from "../config/db-context";
import { moveFileToFps } from "../helpers/file.helper";
import { ActiveStatus, DeletedStaus, IMAGE_TYPE } from "../utils/app-enumeration";
import { DEFAULT_STATUS_CODE_SUCCESS, RECORD_DELETE_SUCCESSFULLY, RECORD_UPDATE_SUCCESSFULLY } from "../utils/app-messages";
import Image from "../model/image.model";
import { columnValueLowerCase, getInitialPaginationFromQuery, getLocalDate, resErrorDataExit, resNotFound, resSuccess } from "../utils/shared-functions";
import Builders from "../model/builders.model";

export const addBuilder = async (req: Request) => {
    const { builder_name } = req.body
    
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
      }
  
      const payload = {
        builder_name: builder_name,
        created_date: getLocalDate(),
        is_deleted: DeletedStaus.InDeleted,
        created_by: req.body.session_res.id_app_user,
        status: ActiveStatus.Active,
        id_image: idImage,
      }
      const builderNameExists = await Builders.findOne({ where: [columnValueLowerCase('builder_name', builder_name), { is_deleted: DeletedStaus.InDeleted }] });
  
      if (builderNameExists === null) {
        await Builders.create(payload, { transaction: trn })
        console.log(payload);
        await trn.commit()
        return resSuccess({ data: payload });
      } else {
        await trn.commit()
        return resErrorDataExit();
      }
    } catch (error) {
      await trn.rollback()
      throw (error)
    }
  }
  
  export const getAllBuilder = async (req: Request) => {
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
              { builder_name: { [Op.iLike]: "%" + pagination.search_text + "%" } },
            ],
          }
          : {},
      ];
  
      if (!noPagination) {
        const totalItems = await Builders.count({
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
  
      const result = await Builders.findAll({
        ...paginationProps,
        where,
        order: [[pagination.sort_by, pagination.order_by]],
        include: [
          { model: Image, as: "image", attributes: [] },
        ],
        attributes: [
          "id",
          "builder_name",
          "created_date",
          "modified_date",
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
  
  export const getByIdBuilder = async (req: Request) => {
    try {
      console.log(req.params.id);
      const builder = await Builders.findOne({ where: { id: req.params.id, is_deleted: DeletedStaus.InDeleted } });
  
      if (!(builder && builder.dataValues)) {
        return resNotFound();
      }
      return resSuccess({ data: builder })
    } catch (error) {
      throw error
    }
  }  
  
  export const updateBuilder = async (req: Request) => {
    const { id,builder_name } = req.body
    const trn = await dbContext.transaction();
    try {
      let idImage = null
      if (req.file) {
        const moveFileResult = await moveFileToFps(
          req.file
        );
        //   console.log(req.file)
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
  
      }
  
      const builderId = await Builders.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }] });
  
      if (builderId) {
        const builderNameExists = await Builders.findOne({ where: [columnValueLowerCase('builder_name', builder_name), { id: { [Op.ne]: id } }, { is_deleted: DeletedStaus.InDeleted }] });
        if (builderNameExists == null) {
          let builderInfo;
          if (idImage) {
            builderInfo = await (Builders.update(
              {
                builder_name: builder_name,
                modified_date: getLocalDate(),
                modified_by: req.body.session_res.id_app_user,
                id_image: idImage,
              },
              { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
            ));
          } else {
            builderInfo = await (Builders.update(
              {
                  builder_name: builder_name,
                  modified_date: getLocalDate(),
                modified_by: req.body.session_res.id_app_user,
              },
              { where: { id: id, is_deleted: DeletedStaus.InDeleted }, transaction: trn }
            ));
          }

          if (builderInfo) {
            const builderInformation = await Builders.findOne({ where: [{ id: id }, { is_deleted: DeletedStaus.InDeleted }], transaction: trn });

            await trn.commit()
            return resSuccess({ data: builderInformation })
          } else {
            await trn.rollback()
            return resErrorDataExit();
          }
        } else {
          await trn.rollback()
          return resErrorDataExit()
        }
      } else {
        await trn.rollback()
        return resNotFound()
      }
  
    } catch (error) {
      await trn.rollback()
      throw (error);
    }
  }
   
  export const deleteBuilder = async (req: Request) => {
  
    try {
      const buildersExists = await Builders.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
  
      if (!(buildersExists && buildersExists.dataValues)) {
        return resNotFound();
      }
      await Builders.update(
        {
          is_deleted: "1",
          modified_by: req.body.session_res.id_app_user,
          modified_date: getLocalDate(),
        },
        { where: { id: buildersExists.dataValues.id } }
      );
  
      return resSuccess({ message: RECORD_DELETE_SUCCESSFULLY });
    } catch (error) {
      throw error
    }
  }
   
  export const statusUpdateBuilder = async (req: Request) => {
    try {
      const builderExists = await Builders.findOne({ where: { id: req.body.id, is_deleted: DeletedStaus.InDeleted } });
      if (builderExists) {
        const builderActionInfo = await (Builders.update(
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
  
  export const BuilderDataApi =async (req:Request) => {
    try {
  
      const shapeData = await Builders.findAll(
        {
          where: {status: ActiveStatus.Active, is_deleted: DeletedStaus.InDeleted},
          include: [
            { model: Image, as: "image", attributes: [] },
          ],
          attributes: [
            "id",
            "builder_name",
          [Sequelize.literal("image.image_path"), "image_path"],
          ]
      })
  
      return resSuccess({data: shapeData})
      
    } catch (error) {
      throw error
    }
  }