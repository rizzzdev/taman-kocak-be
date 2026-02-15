// import { prisma } from "../../app/database/index.js";
// import { localDateNow, nonDeletedDate } from "./date.util.js";

// export const teacherRole = async () => {
//   const isRoleExist = await prisma.role.findUnique({
//     where: {
//       name_appName_deletedAt: {
//         appName: "ALL",
//         name: "TEACHER",
//         deletedAt: nonDeletedDate(),
//       },
//     },
//   });
//   if (isRoleExist) {
//     return isRoleExist;
//   }

//   return await prisma.role.create({
//     data: {
//       name: "TEACHER",
//       appName: "ALL",
//       createdAt: localDateNow(),
//       deletedAt: nonDeletedDate(),
//     },
//   });
// };

// export const studentRole = async () => {
//   const isRoleExist = await prisma.role.findUnique({
//     where: {
//       name_appName_deletedAt: {
//         appName: "ALL",
//         name: "STUDENT",
//         deletedAt: nonDeletedDate(),
//       },
//     },
//   });
//   if (isRoleExist) {
//     return isRoleExist;
//   }

//   return await prisma.role.create({
//     data: {
//       name: "STUDENT",
//       appName: "ALL",
//       createdAt: localDateNow(),
//       deletedAt: nonDeletedDate(),
//     },
//   });
// };

// export const superAdminRole = async () => {
//   const isRoleExist = await prisma.role.findUnique({
//     where: {
//       name_appName_deletedAt: {
//         appName: "ALL",
//         name: "SUPER_ADMIN",
//         deletedAt: nonDeletedDate(),
//       },
//     },
//   });
//   if (isRoleExist) {
//     return isRoleExist;
//   }

//   return await prisma.role.create({
//     data: {
//       name: "SUPER_ADMIN",
//       appName: "ALL",
//       createdAt: localDateNow(),
//       deletedAt: nonDeletedDate(),
//     },
//   });
// };
