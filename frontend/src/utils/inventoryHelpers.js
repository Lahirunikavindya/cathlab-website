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
  if (!Array.isArray(items)) return [];
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

function getCatalogItemNames(inventoryGroup, category, subCategory, itemName) {
  if (itemName) return [itemName];
  if (subCategory) return getItems(inventoryGroup, category, subCategory);
  if (category) {
    return getSubCategories(inventoryGroup, category).flatMap((sub) =>
      getItems(inventoryGroup, category, sub)
    );
  }
  return getCategories(inventoryGroup).flatMap((cat) =>
    getSubCategories(inventoryGroup, cat).flatMap((sub) =>
      getItems(inventoryGroup, cat, sub)
    )
  );
}

export function filterUsageRecords(records, { inventoryGroup, category, subCategory, itemName }) {
  if (!Array.isArray(records) || !inventoryGroup) return records ?? [];

  const allowedNames = getCatalogItemNames(inventoryGroup, category, subCategory, itemName);

  return records.filter((record) => {
    if (record.inventoryGroup) {
      if (record.inventoryGroup !== inventoryGroup) return false;
      if (category && record.category && record.category !== category) return false;
      if (subCategory && record.subCategory && record.subCategory !== subCategory) return false;
      if (itemName && record.itemName !== itemName) return false;
      return true;
    }

    return allowedNames.includes(record.itemName);
  });
}

export function formatInventoryPath(record) {
  const parts = [record.inventoryGroup, record.category, record.subCategory].filter(Boolean);
  if (parts.length > 0) return parts.join(" › ");
  return "—";
}