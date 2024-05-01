function walk(node) {
  for (const subNode in node.children) {
    walk(subNode);
  }
}

