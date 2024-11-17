import { SystemType, SystemModel} from '@tomeforge/shared';

export const getAllSystems = async (): Promise<SystemType[]> => {
  return SystemModel.find().exec();
};

export const addSystem = async (system: SystemType): Promise<SystemType> => {
  const newSystem = new SystemModel(system);
  return newSystem.save();
};

export const modifySystem = async (systemId: number, updates: Partial<SystemType>): Promise<SystemType | null> => {
  return SystemModel.findByIdAndUpdate(systemId, updates, { new: true }).exec();
};

export const deleteSystem = async (systemId: number): Promise<boolean> => {
  try{
    await SystemModel.findByIdAndDelete(systemId).exec();
      return true;
  } catch (error){
      return false;
  }
};