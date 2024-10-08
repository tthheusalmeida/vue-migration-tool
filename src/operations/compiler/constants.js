const NODE_TYPE = {
  TAG: 1,
  STRING_LITERAL: 2,
  EMPTY: 3,
};

const SELF_CLOSING_TAGS = {
  AREA: 'area',
  BASE: 'base',
  BR: 'br',
  COL: 'col',
  COMMAND: 'command',
  EMBED: 'embed',
  HR: 'hr',
  IMG: 'img',
  INPUT: 'input',
  KEYGEN: 'keygen',
  LINK: 'link',
  META: 'meta',
  PARAM: 'param',
  SOURCE: 'source',
  TRACK: 'track',
  WBR: 'wbr',
  CAPITAL_AREA: 'AREA',
  CAPITAL_BASE: 'BASE',
  CAPITAL_BR: 'BR',
  CAPITAL_COL: 'COL',
  CAPITAL_COMMAND: 'COMMAND',
  CAPITAL_EMBED: 'EMBED',
  CAPITAL_HR: 'HR',
  CAPITAL_IMG: 'IMG',
  CAPITAL_INPUT: 'INPUT',
  CAPITAL_KEYGEN: 'KEYGEN',
  CAPITAL_LINK: 'LINK',
  CAPITAL_META: 'META',
  CAPITAL_PARAM: 'PARAM',
  CAPITAL_SOURCE: 'SOURCE',
  CAPITAL_TRACK: 'TRACK',
  CAPITAL_WBR: 'WBR',
};

module.exports = {
  NODE_TYPE,
  SELF_CLOSING_TAGS,
}