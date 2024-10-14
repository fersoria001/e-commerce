export const lookupCategoria = {
  $lookup: {
    from: "subCategorias",
    localField: "_id",
    foreignField: "categoriaId",
    as: "subCategorias",
  },
};