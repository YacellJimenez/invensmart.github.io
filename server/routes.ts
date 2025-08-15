import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertInventorySchema, insertMovementSchema, insertReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Error fetching inventory" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating inventory item" });
    }
  });

  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const validatedData = insertInventorySchema.partial().parse(req.body);
      const item = await storage.updateInventoryItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating inventory item" });
    }
  });

  // Movements routes
  app.get("/api/movements", async (req, res) => {
    try {
      const movements = await storage.getMovements();
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movements" });
    }
  });

  app.post("/api/movements", async (req, res) => {
    try {
      const validatedData = insertMovementSchema.parse(req.body);
      const movement = await storage.createMovement(validatedData);
      res.status(201).json(movement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating movement" });
    }
  });

  app.get("/api/movements/date-range", async (req, res) => {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        return res.status(400).json({ message: "from and to dates are required" });
      }
      const movements = await storage.getMovementsByDateRange(new Date(from as string), new Date(to as string));
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movements by date range" });
    }
  });

  // Reports routes
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      // Transform string dates to Date objects
      const bodyWithDates = {
        ...req.body,
        dateFrom: req.body.dateFrom ? new Date(req.body.dateFrom) : undefined,
        dateTo: req.body.dateTo ? new Date(req.body.dateTo) : undefined,
      };
      
      const validatedData = insertReportSchema.parse(bodyWithDates);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating report" });
    }
  });

  app.delete("/api/reports/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReport(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting report" });
    }
  });

  // Dashboard analytics endpoint
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const movements = await storage.getMovements();
      
      // Calculate metrics
      const totalProducts = products.length;
      const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
      
      // Calculate monthly income/expenses (simplified)
      const monthlyIncome = 54000.00;
      const monthlyExpenses = 32000.00;
      
      // Shipping performance data (mock)
      const shippingData = [
        { month: "Ene", value: 30 },
        { month: "Feb", value: 45 },
        { month: "Mar", value: 35 },
        { month: "Abr", value: 50 },
        { month: "May", value: 40 },
        { month: "Jun", value: 60 },
      ];
      
      // Material distribution data
      const materialData = [
        { name: "CEMENTO", value: 35, color: "#FB923C" },
        { name: "STICKERS", value: 25, color: "#10B981" },
        { name: "BAGS", value: 20, color: "#60A5FA" },
        { name: "BOX", value: 20, color: "#1F2937" },
      ];
      
      res.json({
        monthlyIncome,
        monthlyExpenses,
        totalProducts,
        totalStock,
        shippingData,
        materialData,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
