
import { MetadataInterface, MetadataInterfaceResponse } from 'src/app/interfaces/metadata.interaface';
  
  export class metadataMapper {
    static dependencyStructureToEntity(
      metadata: MetadataInterfaceResponse 
    ): MetadataInterface {
      return {
        id: metadata.id,
        nameHeader: metadata.nombre,
      };
    }
  }
  