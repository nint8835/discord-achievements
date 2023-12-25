module.exports = {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 4,
    plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
    importOrder: ['^@/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
