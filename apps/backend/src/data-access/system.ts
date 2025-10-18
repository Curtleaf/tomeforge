import { SystemType, SystemModel} from '@tomeforge/shared';

export const getAllSystems = async (): Promise<SystemType[]> => {
  return SystemModel.find().exec();
};

export const addSystem = async (system: SystemType): Promise<SystemType> => {
  const newSystem = new SystemModel(system);
  return newSystem.save();
};

export const modifySystem = async (systemId: string, updates: Partial<SystemType>): Promise<SystemType | null> => {
  // Validate that systemId is a string to prevent NoSQL injection
  if (typeof systemId !== 'string') {
    throw new Error('Invalid systemId: must be a string');
  }
  return SystemModel.findByIdAndUpdate(systemId, updates, { new: true }).exec();
};

export const deleteSystem = async (systemId: string): Promise<boolean> => {
  // Validate that systemId is a string to prevent NoSQL injection
  if (typeof systemId !== 'string') {
    throw new Error('Invalid systemId: must be a string');
  }
  try{
    await SystemModel.findByIdAndDelete(systemId).exec();
      return true;
  } catch (error){
      return false;
  }
};