type AnyObject = { [key: string]: any };

export function limitJsonDepth<T extends AnyObject>(obj: T, maxDepth: number): T {
    function recurse(currentObj: any, depth: number): any {
      if (depth > maxDepth) {
        return undefined; // Cortar en el nivel máximo, devolviendo undefined
      }
  
      if (typeof currentObj !== 'object' || currentObj === null) {
        return currentObj; // Si no es un objeto, devolver el valor directamente
      }
  
      if (Array.isArray(currentObj)) {
        const result = currentObj
          .map(item => recurse(item, depth + 1))
          .filter(item => item !== undefined); // Eliminar items undefined
        return result.length > 0 ? result : undefined; // Devolver array vacío como undefined si está vacío
      }
  
      const newObj: AnyObject = {};
  
      Object.keys(currentObj).forEach((key) => {
        const value = recurse(currentObj[key], depth + 1);
        if (value !== undefined) {
          newObj[key] = value;
        }
      });
  
      return Object.keys(newObj).length > 0 ? newObj : undefined; // Devolver objeto vacío como undefined si está vacío
    }
  
    // Hacer una copia profunda del objeto original y aplicar la recursión
    const newObj = JSON.parse(JSON.stringify(obj));
    return recurse(newObj, 1) as T; // Empezar con profundidad 1 y retornar el tipo T
  }