import express from 'express';
import * as systemService from '../services/system';
import { SystemType } from '@tomeforge/shared';

const router = express.Router();

/**
 * @openapi
 * /systems:
 *   get:
 *     summary: Get all game systems
 *     description: Retrieves a list of all game systems in the database. Returns an array of system objects with their complete configuration and rules.
 *     tags:
 *       - Systems
 *     responses:
 *       200:
 *         description: Array of system objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/System'
 *             example:
 *               - systemId: 1
 *                 name: "Dungeons & Dragons 5e"
 *                 description: "Fifth edition D&D ruleset"
 *                 version: "5.0"
 *                 author: "Wizards of the Coast"
 *                 configuration:
 *                   stats:
 *                     - statId: 1
 *                       name: "Strength"
 *                       dataType: "number"
 *                       order: 1
 *                     - statId: 2
 *                       name: "Dexterity"
 *                       dataType: "number"
 *                       order: 2
 *                   skills:
 *                     - skillId: 1
 *                       name: "Athletics"
 *                       dataType: "number"
 *                       order: 1
 *                 rules:
 *                   diceRolling:
 *                     type: "d20"
 *                     dice: 20
 *                     quantity: 1
 *                     modifier: 0
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Database connection failed"
 */
router.get('/systems', async (req, res) => {
  try {
    const systems = await systemService.getAllSystems();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * @openapi
 * /systems:
 *   post:
 *     summary: Create a new game system
 *     description: Creates a new game system with configurations and rules. The system will be assigned a unique systemId automatically.
 *     tags:
 *       - Systems
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemInput'
 *           example:
 *             name: "Custom RPG System"
 *             description: "A homebrew tabletop system"
 *             version: "1.0"
 *             author: "John Doe"
 *             configuration:
 *               stats:
 *                 - statId: 1
 *                   name: "Power"
 *                   dataType: "number"
 *                   order: 1
 *                 - statId: 2
 *                   name: "Agility"
 *                   dataType: "number"
 *                   order: 2
 *               skills:
 *                 - skillId: 1
 *                   name: "Combat"
 *                   dataType: "number"
 *                   order: 1
 *             rules:
 *               diceRolling:
 *                 type: "d6"
 *                 dice: 6
 *                 quantity: 2
 *                 modifier: 3
 *     responses:
 *       201:
 *         description: System created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/System'
 *             example:
 *               systemId: 2
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "Custom RPG System"
 *               description: "A homebrew tabletop system"
 *               version: "1.0"
 *               author: "John Doe"
 *               configuration:
 *                 stats:
 *                   - statId: 1
 *                     name: "Power"
 *                     dataType: "number"
 *                     order: 1
 *                 skills:
 *                   - skillId: 1
 *                     name: "Combat"
 *                     dataType: "number"
 *                     order: 1
 *               rules:
 *                 diceRolling:
 *                   type: "d6"
 *                   dice: 6
 *                   quantity: 2
 *                   modifier: 3
 *       400:
 *         description: Invalid request body or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation failed: name is required"
 */
router.post('/systems', async (req, res) => {
  try {
    const systemData: SystemType = req.body;
    const newSystem = await systemService.createSystem(systemData);
    res.status(201).json(newSystem);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

/**
 * @openapi
 * /systems/{systemId}:
 *   put:
 *     summary: Update a game system
 *     description: Updates an existing game system by its numeric ID. All fields in the request body will overwrite existing values.
 *     tags:
 *       - Systems
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the system to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemInput'
 *           example:
 *             name: "Updated System Name"
 *             description: "Updated description"
 *             version: "2.0"
 *             author: "Jane Smith"
 *             configuration:
 *               stats:
 *                 - statId: 1
 *                   name: "Strength"
 *                   dataType: "number"
 *                   order: 1
 *               skills:
 *                 - skillId: 1
 *                   name: "Athletics"
 *                   dataType: "number"
 *                   order: 1
 *             rules:
 *               diceRolling:
 *                 type: "d20"
 *                 dice: 20
 *                 quantity: 1
 *                 modifier: 2
 *     responses:
 *       200:
 *         description: System updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/System'
 *             example:
 *               systemId: 1
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "Updated System Name"
 *               description: "Updated description"
 *               version: "2.0"
 *               author: "Jane Smith"
 *               configuration:
 *                 stats:
 *                   - statId: 1
 *                     name: "Strength"
 *                     dataType: "number"
 *                     order: 1
 *                 skills:
 *                   - skillId: 1
 *                     name: "Athletics"
 *                     dataType: "number"
 *                     order: 1
 *               rules:
 *                 diceRolling:
 *                   type: "d20"
 *                   dice: 20
 *                   quantity: 1
 *                   modifier: 2
 *       404:
 *         description: System not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "System not found"
 *       400:
 *         description: Invalid request body or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation failed: configuration is required"
 */
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

/**
 * @openapi
 * /systems/{systemId}:
 *   delete:
 *     summary: Delete a game system
 *     description: Permanently deletes a game system by its numeric ID. This operation cannot be undone.
 *     tags:
 *       - Systems
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the system to delete
 *         example: 1
 *     responses:
 *       204:
 *         description: System deleted successfully (no content)
 *       404:
 *         description: System not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "System not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Database error occurred"
 */
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

/**
 * Future Query Parameter Patterns
 *
 * When implementing pagination, filtering, and sorting in the future,
 * follow these standard patterns:
 *
 * GET /systems?limit=10&offset=0&sort=name
 *
 * Query Parameters:
 * - limit: Number of results to return (default: 50, max: 100)
 * - offset: Number of results to skip for pagination (default: 0)
 * - sort: Field to sort by (e.g., 'name', '-name' for descending)
 * - filter: Filter by field values (e.g., 'author=John')
 *
 * OpenAPI Documentation Pattern:
 * parameters:
 *   - in: query
 *     name: limit
 *     schema:
 *       type: integer
 *       minimum: 1
 *       maximum: 100
 *       default: 50
 *     description: Maximum number of results to return
 *   - in: query
 *     name: offset
 *     schema:
 *       type: integer
 *       minimum: 0
 *       default: 0
 *     description: Number of results to skip (for pagination)
 *   - in: query
 *     name: sort
 *     schema:
 *       type: string
 *       enum: [name, -name, systemId, -systemId]
 *     description: Field to sort by (prefix with - for descending order)
 */

export default router;
