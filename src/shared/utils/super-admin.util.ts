// import { teacherRepo } from "../../modules/master/teacher/repo/teacher.repo.js";
// import { envConfig } from "../configs/env.config.js";
// import { superAdminRole } from "./role.util.js";
// import { authRoleRepo } from "../../modules/auth/auth-role/repo/auth-role.repo.js";
// import { TeacherEntity } from "../../modules/master/teacher/domain/teacher.entity.js";

// export const createSuperAdmin = async () => {
//   const isSuperAdminExist = await teacherRepo.getTeachers({
//     email: envConfig.superAdminEmail!,
//     includeRoles: true,
//   });
//   if (isSuperAdminExist.length > 0) {
//     return isSuperAdminExist[0];
//   }

//   const superAdmin = await teacherRepo.postTeacher(
//     {
//       fullname: "Super Admin",
//       gender: "MALE",
//       email: envConfig.superAdminEmail!,
//       password: envConfig.superAdminPassword!,
//     },
//     {
//       includeRoles: true,
//     },
//   );

//   const role = await superAdminRole();
//   const authRole = await authRoleRepo.postAuthRole({
//     email: superAdmin.email,
//     roleId: role.id,
//   });

//   const data: TeacherEntity = {
//     id: superAdmin.id,
//     fullname: superAdmin.fullname,
//     gender: superAdmin.gender,
//     email: superAdmin.email,
//     roles: [...superAdmin.roles!, authRole.role],
//     createdAt: superAdmin.createdAt,
//     lastUpdatedAt: superAdmin.lastUpdatedAt,
//     deletedAt: superAdmin.deletedAt,
//   };

//   return data;
// };

// createSuperAdmin().then(console.log);
