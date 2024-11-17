import express from 'express';
import * as systemService from '../services/system';
import { SystemType } from '@tomeforge/shared';

const router = express.Router();

// Get all systems
router.get('/systems', async (req, res) => {
  try {
    const systems = await systemService.getAllSystems();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create a new system
router.post('/systems', async (req, res) => {
  try {
    const systemData: SystemType = req.body;
    const newSystem = await systemService.createSystem(systemData);
    res.status(201).json(newSystem);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Update system by ID
router.put('/systems/:systemId', async (req, res) => {
  try {
    const systemId = parseInt(req.params.systemId);
    const updatedSystem = await systemService.updateSystem(systemId, req.body);
    if (!updatedSystem) {
      return res.status(404).json({ error: 'System not found' });
    }
    res.json(updatedSystem);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Delete system by ID
router.delete('/systems/:systemId', async (req, res) => {
  try {
    const systemId = parseInt(req.params.systemId);
    const deletedSystem = await systemService.removeSystem(systemId);
    if (!deletedSystem) {
      return res.status(404).json({ error: 'System not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
