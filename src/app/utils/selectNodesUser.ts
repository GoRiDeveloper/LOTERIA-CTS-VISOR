import { TreeNode } from 'primeng/api/treenode';

export const selectNodes = async (
  tree: TreeNode[],
  checkedNodes: TreeNode[],
  keys: string[]
): Promise<void> => {
  // Iterate through each node of the tree and select nodes
  let count = tree.length;
  for (const node of tree) {
    // Si la clave del nodo actual está en la lista de claves a seleccionar o su padre está seleccionado, selecciona este nodo también
    if (
      (node.key && keys.includes(node.key)) ||
      (node.parent && checkedNodes.includes(node.parent))
    ) {
      checkedNodes.push(node);
      count--;
    }

    // Mirar también a los hijos del nodo actual
    if (node.children) {
      await selectNodes(node.children, checkedNodes, keys);
    }
  }

  // Una vez que todos los nodos de un árbol son revisados para selección, ver si solo algunos nodos están seleccionados y hacer que este nodo esté parcialmente seleccionado
  if (tree.length > 0 && tree[0].parent) {
    tree[0].parent.partialSelected = count > 0 && count !== tree.length;
  }
};
