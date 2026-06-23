import cathLabInventory from "../data/cathLabInventory";

export function getInventoryGroups() {
  return cathLabInventory.map((group) => group.inventoryGroup);
}

export function getCategories(inventoryGroup) {
  const group = cathLabInventory.find((g) => g.inventoryGroup === inventoryGroup);
  return group?.categories.map((c) => c.category) ?? [];
}

export function getSubCategories(inventoryGroup, category) {
  const group = cathLabInventory.find((g) => g.inventoryGroup === inventoryGroup);
  const cat = group?.categories.find((c) => c.category === category);
  return cat?.subCategories.map((sc) => sc.name) ?? [];
}

export function getItems(inventoryGroup, category, subCategory) {
  const group = cathLabInventory.find((g) => g.inventoryGroup === inventoryGroup);
  const cat = group?.categories.find((c) => c.category === category);
  const sub = cat?.subCategories.find((sc) => sc.name === subCategory);
  return sub?.items ?? [];
}

function getInStockItems(items) {
  return items.filter((item) => item.quantity > 0);
}

export function getAvailableInventoryGroups(items) {
  const groupsWithStock = new Set(
    getInStockItems(items).map((item) => item.inventoryGroup).filter(Boolean)
  );
  return getInventoryGroups().filter((group) => groupsWithStock.has(group));
}

export function getAvailableCategories(items, inventoryGroup) {
  const inStock = getInStockItems(items).filter(
    (item) => item.inventoryGroup === inventoryGroup
  );
  const categoriesWithStock = new Set(inStock.map((item) => item.category).filter(Boolean));
  return getCategories(inventoryGroup).filter((category) => categoriesWithStock.has(category));
}

export function getAvailableSubCategories(items, inventoryGroup, category) {
  const inStock = getInStockItems(items).filter(
    (item) => item.inventoryGroup === inventoryGroup && item.category === category
  );
  const subCategoriesWithStock = new Set(
    inStock.map((item) => item.subCategory).filter(Boolean)
  );
  return getSubCategories(inventoryGroup, category).filter((subCategory) =>
    subCategoriesWithStock.has(subCategory)
  );
}

export function getAvailableItemNames(items, inventoryGroup, category, subCategory) {
  const inStock = getInStockItems(items).filter(
    (item) =>
      item.inventoryGroup === inventoryGroup &&
      item.category === category &&
      item.subCategory === subCategory
  );
  const itemNamesWithStock = new Set(inStock.map((item) => item.itemName));
  return getItems(inventoryGroup, category, subCategory).filter((itemName) =>
    itemNamesWithStock.has(itemName)
  );
}

export function getStockRecords(items, inventoryGroup, category, subCategory, itemName) {
  return getInStockItems(items).filter(
    (item) =>
      item.inventoryGroup === inventoryGroup &&
      item.category === category &&
      item.subCategory === subCategory &&
      item.itemName === itemName
  );
}