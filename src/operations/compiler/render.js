const generator = require('@babel/generator').default;
const { format } = require('prettier');
const {
  NODE_TYPE,
  SELF_CLOSING_TAGS,
} = require('./constants.js');

async function runRender(ast) {
  const vueTemplateRendered = await renderTemplate(ast.template.ast);
  const vueScriptRendered = await renderScript(ast.script);

  return `${vueTemplateRendered}\n${vueScriptRendered}\n${ast.styleString}\n`;
}

// Template render
async function renderTemplate(ast) {
  const renderedTag = renderTag(ast);
  const formattedTemplate = await format(renderedTag, {
    parser: 'vue',
  });

  return formattedTemplate;
}

function renderTag(node) {
  const upperTag = node?.tag ? node.tag.toUpperCase() : '';

  const isSelfClosingTag = SELF_CLOSING_TAGS[upperTag] || SELF_CLOSING_TAGS[`CAPITAL_${upperTag}`];
  if (isSelfClosingTag) {
    return renderOpenTag(node);
  } else {
    return renderTagByType(node)
  }
}

function renderTagByType(node) {
  let renderedTag = '';

  if (node?.type === NODE_TYPE.TAG) {
    renderedTag += renderOpenTag(node);

    const hasChildren = node.children?.length;
    if (hasChildren) {
      node.children.forEach(childNode => {
        renderedTag += `${renderTag(childNode)}`;
      });
    }
    renderedTag += renderCloseTag(node);
  } else if (node?.type === NODE_TYPE.TEMPLATE_STRING) {
    renderedTag += node.text.replace(/^\s+|\s+$/g, '');
  } else {
    renderedTag += '';
  }

  const hasIfConditions = node?.ifConditions ? node.ifConditions.length : '';
  if (hasIfConditions) {
    node.ifConditions.forEach(item => {
      renderedTag += `${renderTag(item.block)}`;
    });
  }

  return renderedTag;
}

function renderAttrsMap(attrs) {
  let renderedAttrs = '';
  Object.keys(attrs).forEach(key => {
    if (!attrs[key]) {
      renderedAttrs += `${key} `;
      return;
    }

    renderedAttrs += `${key}="${attrs[key]}" `;
  });

  return renderedAttrs.slice(0, -1);
}

function renderOpenTag(node) {
  const isThereAttributes = Object.keys(node.attrsMap ? node.attrsMap : {}).length;
  if (!isThereAttributes) {
    return `<${node.tag}>`;
  }

  return `<${node.tag} ${renderAttrsMap(node.attrsMap)}>`;
}

function renderCloseTag(node) {
  if (!node.tag) {
    return '';
  }

  return `</${node.tag}>`;
}

// Script render
function renderScript(ast) {
  if (Object.keys(ast).length === 0) {
    return '';
  }

  return `<script>\n${generator(ast).code}\n</script>\n`;
}

module.exports = {
  runRender,
  renderTemplate,
  renderTag,
  renderTagByType,
  renderAttrsMap,
  renderOpenTag,
  renderCloseTag,
  renderScript,
}