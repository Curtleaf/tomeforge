import { SystemType } from "@tomeforge/shared";
import * as systemRepository from '../data-access/system';

export const getAllSystems = async (): Promise<SystemType[]> => {
  // Perform any necessary validation or business logic before fetching
  return systemRepository.getAllSystems();
};

export const createSystem = async (systemData: SystemType): Promise<SystemType> => {
  // Perform any necessary validation or business logic before saving
  return systemRepository.addSystem(systemData);
};

export const updateSystem = async (systemId: number, updates: Partial<SystemType>): Promise<SystemType | null> => {
  // Perform any necessary validation or business logic before updating
  return systemRepository.modifySystem(systemId, updates);
};

export const removeSystem = async (systemId: number): Promise<boolean> => {
  // Perform any necessary validation or business logic before deleting
  return systemRepository.deleteSystem(systemId);
};
