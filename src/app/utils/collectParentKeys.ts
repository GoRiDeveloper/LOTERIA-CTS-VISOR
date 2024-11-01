import { dependencyStructure } from "../interfaces/dependencyStructure.interface";

export const collectParentKeys = (
    dependency: dependencyStructure,
    idSet: Set<string>
  ) => {
    if (dependency.parent) {
      const parentKey = dependency.parent.key!;
      idSet.add(parentKey);
      collectParentKeys(dependency.parent, idSet);
    }
  };