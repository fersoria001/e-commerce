export const lookupCategoria = {
  $lookup: {
    from: "categorias",
    localField: "categoria",
    foreignField: "_id",
    as: "categoria",
  },
};
export const unwindCategoria = { $unwind: "$categoria" };
export const lookupSubCategoria = {
  $lookup: {
    from: "subCategorias",
    localField: "subCategoria",
    foreignField: "_id",
    as: "subCategoria",
  },
};
export const unwindSubCategoria = { $unwind: "$subCategoria" };
