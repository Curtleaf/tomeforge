# Product Mission

## Pitch
TomeForge is a unified, system-agnostic platform that helps game designers, publishers, game masters, and players manage tabletop gaming experiences by providing a single source of truth for game systems, character management, campaign tools, and content sharing—all driven entirely by dynamic, data-driven architecture.

## Users

### Primary Customers
- **Game Designers**: Creators building new tabletop RPG systems who need tools to define, test, and share their rule systems
- **Publishers**: Companies and individuals publishing tabletop game content who need a platform to distribute and monetize their work
- **Game Masters**: Organizers running campaigns who need integrated tools for session management, content organization, and player coordination
- **Players**: Participants in tabletop games who need character creation, management, and gameplay tools

### User Personas

**The Independent Designer** (25-45)
- **Role:** Solo game designer or small studio creator
- **Context:** Building a new tabletop RPG system (like Stars Without Number, FATE, etc.) and needs to prototype, test, and share rules
- **Pain Points:** Existing tools are locked to specific game systems (D&D 5e); no way to quickly prototype and test custom mechanics; hard to share work-in-progress with playtesters
- **Goals:** Rapidly iterate on game mechanics, create custom character sheets, share systems with community, gather feedback

**The Content Publisher** (30-55)
- **Role:** Publisher of supplements, adventures, and third-party content
- **Context:** Creates paid and free content for multiple game systems
- **Pain Points:** No unified marketplace across systems; data locked in proprietary formats; difficult to manage content across multiple platforms
- **Goals:** Reach players across different game systems, monetize content effectively, maintain control over their intellectual property

**The Tech-Savvy Game Master** (22-50)
- **Role:** GM running ongoing campaigns with multiple tools
- **Context:** Currently juggling D&D Beyond, Foundry VTT, World Anvil, Discord, and custom spreadsheets
- **Pain Points:** Context switching between 5+ different tools during sessions; duplicated data entry; no single source of truth; difficult to customize tools for homebrew rules
- **Goals:** Streamline session management, automate repetitive tasks, integrate all tools in one place, customize for house rules

**The Casual Player** (18-40)
- **Role:** Player participating in weekly or monthly campaigns
- **Context:** Plays multiple systems (D&D, Pathfinder, indie games) and struggles with different character sheet formats
- **Pain Points:** Learning new character sheet layouts for each system; losing track of character progression; no mobile-friendly tools for some systems
- **Goals:** Easy character creation, mobile access during sessions, track progression across campaigns

## The Problem

### Fragmented Ecosystem Wastes Time and Creativity
The tabletop gaming community is forced to use multiple disconnected platforms, each locked to specific game systems or use cases. Game designers building new systems have no tools to prototype and share their work. GMs spend hours copying data between platforms instead of focusing on storytelling. Players struggle with different interfaces for each system they play.

**Quantifiable Impact:** GMs spend an average of 2-3 hours per session on administrative overhead across multiple tools. Game designers spend months building custom tools just to playtest their systems. Content creators must publish to 3-5 different platforms to reach their audience.

**Our Solution:** A unified, data-driven platform where game systems define their own structure. One platform that adapts to any game system—from D&D to Mouse Trap—without being locked to any specific ruleset.

### Data Lock-In Prevents Innovation
Existing platforms own your data and force you into their ecosystem. D&D Beyond only works for D&D 5e. World Anvil doesn't integrate with gameplay tools. VTTs lock content behind proprietary formats.

**Quantifiable Impact:** Thousands of dollars spent re-purchasing content across platforms. Years of world-building data trapped in proprietary formats. Inability to migrate or share content freely.

**Our Solution:** Users maintain ownership and control of their data. Dynamic, type-safe data structures ensure portability. Open integration capabilities allow connection to other tools while keeping TomeForge as the source of truth.

### No System-Agnostic Tools for Modern Play
Current tools assume you're playing one specific game system or force you to work around limitations designed for a different system.

**Quantifiable Impact:** Indie game systems with smaller communities have no digital tools, limiting their reach. Homebrew content requires workarounds and hacks. Players avoid trying new systems because of the tooling gap.

**Our Solution:** Completely system-agnostic architecture where the data defines the structure. Create tools once that work for any game system, from traditional RPGs to experimental indie games to board games.

## Differentiators

### Data-Driven, Type-Safe Architecture
Unlike D&D Beyond or Roll20 which are hardcoded to specific systems, TomeForge uses dynamic data structures where types define everything. Game designers define their system's rules and structure, and the platform automatically generates appropriate interfaces and tools.

This results in a single platform that works for D&D, Pathfinder, FATE, Stars Without Number, or a game you invented last week—without requiring platform-level code changes.

### Single Source of Truth for Everything
Unlike the current fragmented ecosystem (D&D Beyond for characters, World Anvil for lore, Foundry for VTT, DMs Guild for content), TomeForge provides one unified platform where all game data lives.

This results in zero data duplication, seamless integration between tools (rules inform automation, characters connect to campaigns, systems inherit from each other), and massive time savings for GMs and players.

### User Ownership and Open Integration
Unlike proprietary platforms that lock data in walled gardens, TomeForge keeps data in the hands of designers, publishers, and users while providing robust APIs and webhooks for external tool integration.

This results in true data portability, ability to use TomeForge alongside existing tools (like Foundry VTT), and a platform that enhances rather than replaces your existing workflow.

### Mobile-First, Adaptive Interface
Unlike tools built for desktop and awkwardly adapted to mobile, TomeForge is designed mobile-first with dynamic, data-driven UI that adapts to any screen size and allows users to customize their layout.

This results in seamless experiences from phone to tablet to desktop, accessibility during live play, and interfaces that adapt to your specific game system's needs.

## Core Principles

### System-Agnostic by Design
Every feature works for any game system. No assumptions about D&D, point-buy, classes, levels, or any specific mechanics. The data defines the structure.

**What This Means in Practice:**

*Supported Game Types:*
- Traditional tabletop RPGs (D&D, Pathfinder, Call of Cthulhu, etc.)
- Indie narrative RPGs (FATE, Powered by the Apocalypse, Fiasco, etc.)
- Point-buy and classless systems (GURPS, Shadowrun, Stars Without Number)
- Board games with character progression (Gloomhaven, Descent, etc.)
- Card-based RPGs with persistent characters
- Experimental or hybrid game systems

*Edge Cases & Boundaries:*
- **Physical Dexterity Games:** Games requiring real-world physical actions (Jenga-based mechanics, throwing objects) can track results but not facilitate the physical component
- **Real-Time Video Games:** Systems designed for video game implementation (action combat, platforming) are out of scope
- **Purely Social Games:** Games with no quantifiable mechanics or character data (pure improv theater) may have limited benefit from the platform

*When Custom Code Is Needed:*
- TomeForge handles data-driven game logic through configuration
- Complex mathematical formulas and automation can be defined through rule configurations
- If a game mechanic cannot be expressed through data configuration, it may require custom scripting (future feature: embedded JavaScript/Lua for advanced automation)
- The goal is 95%+ of game mechanics expressible through configuration alone

### Data Ownership and Portability
Users, designers, and publishers own their data. Type-safe structures ensure consistency while maintaining flexibility. Data can be exported, shared, and integrated with external tools.

### Single Pane of Glass
One platform for creation, organization, play, and sharing. Reduce context switching. Integrate tools that currently live in separate applications.

### Progressive Enhancement
Start with core infrastructure and expand outward. Each feature should work independently while being enhanced by integration with other features.

### Open and Extensible
Webhooks, WebSockets, APIs, and integrations allow TomeForge to work alongside existing tools. Not a walled garden, but a central hub.

## Key Features

### Core Platform Features
- **User Management & Authentication:** Secure login, user profiles, role-based permissions, and account management
- **World/Workspace Management:** Top-level organizational containers for grouping games, systems, and campaigns
- **System Builder:** Dynamic, data-driven game system creation with configurable stats, skills, rules, and mechanics
- **Character Sheet Engine:** Fully customizable character sheets that adapt to any game system with sensible defaults
- **Campaign Management:** Organize sessions, players, notes, and resources in one place

### Content & Sharing Features
- **Content Marketplace:** Buy, sell, and share game systems, adventures, supplements, and tools—both paid and free
- **Dynamic Inheritance:** Systems can inherit from and modify other systems, enabling rapid prototyping and house rules
- **Collaboration Tools:** Commenting, discussions, or integration with discussion platforms for community feedback
- **Sharing Controls:** Granular permissions for sharing content publicly, with specific users, or keeping private

### Gameplay Tools
- **Combat Tracker:** Initiative tracking, turn management, and health monitoring
- **Dice Engine:** Configurable dice rolling that adapts to system rules with automation support
- **Note-Taking:** Character-bound notes, session notes, and general campaign documentation
- **Inventory Management:** Dynamic item and equipment tracking defined by game system rules
- **Skills & Knowledge Tracking:** Manage character progression, abilities, and system-specific mechanics

### Integration Features
- **File Storage:** Store and organize PDFs, VTT modules, game books, and campaign assets
- **VTT Integration:** Connect with virtual tabletops (especially Foundry) for file synchronization and module management
- **Webhooks & WebSockets:** Real-time updates during live play and integration with external tools
- **API Access:** Robust programmatic access for custom integrations and automation

### Advanced Features
- **Rule Automation:** Leverage having rules, systems, and play data in the same platform to automate gameplay mechanics
- **Dynamic UI Builder:** Users can customize interface layouts and components based on their needs and screen size
- **Live Play Support:** Real-time synchronization during active sessions with WebSocket connections
- **World Building Tools:** Integrate lore, locations, NPCs, and documentation alongside gameplay mechanics

## Success Criteria

TomeForge succeeds when:
- Game designers can prototype and publish a new system in days instead of months
- GMs spend less than 30 minutes on administrative overhead per session
- Players can create characters for any game system in under 10 minutes
- The platform hosts vibrant marketplaces for both mainstream and indie game content
- Users choose TomeForge as their single source of truth while integrating it with their existing tools
- The architecture handles everything from complex RPGs to simple board games without code changes

## Long-Term Vision

TomeForge aims to become the central hub for the entire tabletop gaming lifecycle—from initial game design through playtesting, publishing, world building, campaign management, and live play. A platform that removes barriers to creativity, reduces administrative overhead, and empowers the global tabletop gaming community to create, share, and play any game they can imagine.

This is achieved not by replacing every tool, but by providing a flexible, data-driven foundation that works alongside existing tools while offering deep integration and automation for users who want a unified experience.
