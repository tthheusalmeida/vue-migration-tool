const generator = require('@babel/generator').default;
const { format } = require('prettier');
const { REGEX } = require('../../utils/regex.js');
const {
  MIGRATION,
  showLog,
} = require('../../utils/message.js');
const {
  NODE_TYPE,
  SELF_CLOSING_TAGS,
} = require('./constants.js');

async function runRender(ast, fileExtension) {
  const vueTemplateRendered = await renderTemplate(ast.template.ast);
  const vueScriptRendered = await renderScript(ast.script, fileExtension);

  if (fileExtension === '.js') {
    return `${vueScriptRendered}\n`;
  }

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

  const isHtmlSelfClosingTag = SELF_CLOSING_TAGS[upperTag] || SELF_CLOSING_TAGS[`CAPITAL_${upperTag}`];
  if (isHtmlSelfClosingTag) {
    return renderOpenTag(node);
  } else {
    return renderTagByType(node)
  }
}

function renderTagByType(node) {
  let renderedTag = '';

  if (node?.type === NODE_TYPE.TAG) {
    const isKebabCaseTag = node.tag.match(REGEX.COMPILER.RENDER.VUE_COMPONENT_NAME_KEBAB_CASE);
    const isPascalCaseTag = node.tag.match(REGEX.COMPILER.RENDER.VUE_COMPONENT_NAME_PASCAL_CASE);

    if (isKebabCaseTag || isPascalCaseTag) {
      /*
        kebab-case and Pascal Case are highly recommended way to write Vue component name
        https://v2.vuejs.org/v2/guide/components-registration?redirect=true
      */
      const hasChildren = node.children?.length;
      if (hasChildren) {
        renderedTag += renderOpenTag(node);

        node.children.forEach(childNode => {
          renderedTag += `${renderTag(childNode)}`;
        });

        renderedTag += renderCloseTag(node);
      } else {
        renderedTag += renderSelfCloseVueTag(node);
      }
    } else {
      renderedTag += renderOpenTag(node);

      const hasChildren = node.children?.length;
      if (hasChildren) {
        node.children.forEach(childNode => {
          renderedTag += `${renderTag(childNode)}`;
        });
      }
      renderedTag += renderCloseTag(node);
    }
  } else if (node?.type === NODE_TYPE.STRING_LITERAL) {
    renderedTag += renderStringLiteral(node);
  } else {
    renderedTag += node?.text ? node.text.trim() : '';
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

function renderSelfCloseVueTag(node) {
  const isThereAttributes = Object.keys(node.attrsMap ? node.attrsMap : {}).length;
  if (!isThereAttributes) {
    return `<${node.tag} />`;
  }

  return `<${node.tag} ${renderAttrsMap(node.attrsMap)} />`;
}

function renderStringLiteral(node) {
  const { tokens } = node;
  if (!tokens) {
    return '';
  }

  let render = '';
  tokens.forEach(token => {
    const isString = typeof token === 'string';

    if (isString) {
      render += ' ' + token.replace(REGEX.COMPILER.RENDER.LINE_SEPARETOR, '').trim() + ' ';
    } else {
      const template = token['@binding'];
      const regex = REGEX.COMPILER.RENDER.FILTER_FUNCTION_COMPLETE;

      let methodsList = template.match(regex);
      const isFilterOnTemplate = template.match(REGEX.COMPILER.RENDER.FILTER_FUNCTION);
      if (isFilterOnTemplate) {
        methodsList = methodsList?.map(item =>
          item
            .replace(REGEX.COMPILER.RENDER.FILTER, '')
            .replace(REGEX.COMPILER.RENDER.OPEN_BRACKETS, '')
            .replace(REGEX.COMPILER.RENDER.CLOSE_BRACKETS, '')
            .replace(REGEX.COMPILER.RENDER.DOUBLE_QUOTE, '')
        );

        render += '{{ ' + renderFiltersWithParam(methodsList) + ' }}';

        showLog(MIGRATION.VUE.FILTERS);
        return;
      }

      render += '{{ ' + template + ' }}';
    }
  });

  return render.trim();
}

function renderFiltersWithParam(data, index = 0) {
  if (data.length <= 0) {
    return '';
  }

  if (data[index + 1]) {
    return data[index] + '(' + renderFiltersWithParam(data, index + 1) + ')';
  }
  return data[index];
}


// Script render
function renderScript(ast, fileExtension) {
  if (Object.keys(ast).length === 0) {
    return '';
  }

  if (fileExtension === '.vue') {
    return `<script>\n${generator(ast).code}\n</script>\n`;
  }

  const options = {
    jsescOption: {
      quotes: 'single',
    },
  };

  return generator(ast, options).code;
}

module.exports = {
  runRender,
  renderTemplate,
  renderTag,
  renderTagByType,
  renderAttrsMap,
  renderOpenTag,
  renderCloseTag,
  renderSelfCloseVueTag,
  renderStringLiteral,
  renderFiltersWithParam,
  renderScript,
}