import { type Product, type InsertProduct, type Inventory, type InsertInventory, type Movement, type InsertMovement, type Report, type InsertReport } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Inventory
  getInventory(): Promise<Inventory[]>;
  getInventoryItem(id: string): Promise<Inventory | undefined>;
  getInventoryByProductId(productId: string): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: string, item: Partial<InsertInventory>): Promise<Inventory | undefined>;
  deleteInventoryItem(id: string): Promise<boolean>;

  // Movements
  getMovements(): Promise<Movement[]>;
  getMovement(id: string): Promise<Movement | undefined>;
  createMovement(movement: InsertMovement): Promise<Movement>;
  getMovementsByDateRange(from: Date, to: Date): Promise<Movement[]>;

  // Reports
  getReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  deleteReport(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private inventory: Map<string, Inventory>;
  private movements: Map<string, Movement>;
  private reports: Map<string, Report>;

  constructor() {
    this.products = new Map();
    this.inventory = new Map();
    this.movements = new Map();
    this.reports = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample products
    const sampleProducts: Product[] = [
      {
        id: "p1",
        ref: "P001",
        name: "Cemento Portland",
        category: "Categoria A",
        price: "25.50",
        stock: 150,
        createdAt: new Date(),
      },
      {
        id: "p2",
        ref: "P002",
        name: "Adhesivos Industriales",
        category: "Categoria B",
        price: "45.00",
        stock: 75,
        createdAt: new Date(),
      },
      {
        id: "p3",
        ref: "P003",
        name: "Bolsas de Empaque",
        category: "Categoria C",
        price: "12.99",
        stock: 200,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));

    // Sample inventory
    const sampleInventory: Inventory[] = [
      {
        id: "i1",
        productId: "p1",
        unit: "Sacos",
        stock: 150,
        status: "disponible",
        updatedAt: new Date(),
      },
      {
        id: "i2",
        productId: "p2",
        unit: "Litros",
        stock: 75,
        status: "disponible",
        updatedAt: new Date(),
      },
      {
        id: "i3",
        productId: "p3",
        unit: "Unidades",
        stock: 200,
        status: "disponible",
        updatedAt: new Date(),
      },
    ];

    sampleInventory.forEach(item => this.inventory.set(item.id, item));

    // Sample movements
    const sampleMovements: Movement[] = [
      {
        id: "m1",
        ref: "MOV001",
        productId: "p1",
        type: "entrada",
        quantity: 50,
        description: "Entrada de cemento",
        userId: "admin",
        createdAt: new Date(),
      },
      {
        id: "m2",
        ref: "MOV002",
        productId: "p2",
        type: "salida",
        quantity: -25,
        description: "Salida de adhesivos",
        userId: "vendedor",
        createdAt: new Date(),
      },
    ];

    sampleMovements.forEach(movement => this.movements.set(movement.id, movement));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      stock: insertProduct.stock || 0,
    };
    this.products.set(id, product);
    
    // Create corresponding inventory item
    const stock = insertProduct.stock || 0;
    const inventoryItem: Inventory = {
      id: randomUUID(),
      productId: id,
      unit: "Unidades",
      stock: stock,
      status: stock > 10 ? "disponible" : stock > 0 ? "bajo_stock" : "agotado",
      updatedAt: new Date(),
    };
    this.inventory.set(inventoryItem.id, inventoryItem);
    
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct: Product = { ...product, ...updateData };
    this.products.set(id, updatedProduct);

    // Update inventory if stock changed
    if (updateData.stock !== undefined) {
      const inventoryItem = Array.from(this.inventory.values()).find(item => item.productId === id);
      if (inventoryItem) {
        inventoryItem.stock = updateData.stock;
        inventoryItem.status = updateData.stock > 10 ? "disponible" : updateData.stock > 0 ? "bajo_stock" : "agotado";
        inventoryItem.updatedAt = new Date();
        this.inventory.set(inventoryItem.id, inventoryItem);
      }
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = this.products.delete(id);
    
    // Also delete from inventory
    const inventoryItem = Array.from(this.inventory.values()).find(item => item.productId === id);
    if (inventoryItem) {
      this.inventory.delete(inventoryItem.id);
    }
    
    return deleted;
  }

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItem(id: string): Promise<Inventory | undefined> {
    return this.inventory.get(id);
  }

  async getInventoryByProductId(productId: string): Promise<Inventory | undefined> {
    return Array.from(this.inventory.values()).find(item => item.productId === productId);
  }

  async createInventoryItem(insertItem: InsertInventory): Promise<Inventory> {
    const id = randomUUID();
    const item: Inventory = {
      ...insertItem,
      id,
      updatedAt: new Date(),
    };
    this.inventory.set(id, item);
    return item;
  }

  async updateInventoryItem(id: string, updateData: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;

    const updatedItem: Inventory = { ...item, ...updateData, updatedAt: new Date() };
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    return this.inventory.delete(id);
  }

  // Movements
  async getMovements(): Promise<Movement[]> {
    return Array.from(this.movements.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getMovement(id: string): Promise<Movement | undefined> {
    return this.movements.get(id);
  }

  async createMovement(insertMovement: InsertMovement): Promise<Movement> {
    const id = randomUUID();
    const movement: Movement = {
      ...insertMovement,
      id,
      createdAt: new Date(),
      description: insertMovement.description || null,
    };
    this.movements.set(id, movement);

    // Update inventory stock
    const inventoryItem = Array.from(this.inventory.values()).find(item => item.productId === insertMovement.productId);
    if (inventoryItem) {
      inventoryItem.stock += insertMovement.quantity;
      inventoryItem.status = inventoryItem.stock > 10 ? "disponible" : inventoryItem.stock > 0 ? "bajo_stock" : "agotado";
      inventoryItem.updatedAt = new Date();
      this.inventory.set(inventoryItem.id, inventoryItem);

      // Also update product stock
      const product = this.products.get(insertMovement.productId);
      if (product) {
        product.stock = inventoryItem.stock;
        this.products.set(product.id, product);
      }
    }

    return movement;
  }

  async getMovementsByDateRange(from: Date, to: Date): Promise<Movement[]> {
    return Array.from(this.movements.values()).filter(movement => {
      const movementDate = new Date(movement.createdAt!);
      return movementDate >= from && movementDate <= to;
    });
  }

  // Reports
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = {
      ...insertReport,
      id,
      createdAt: new Date(),
      data: insertReport.data || null,
      description: insertReport.description || null,
    };
    this.reports.set(id, report);
    return report;
  }

  async deleteReport(id: string): Promise<boolean> {
    return this.reports.delete(id);
  }
}

export const storage = new MemStorage();
