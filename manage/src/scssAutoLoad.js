
// 自动加载src下的scss文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
const context = require.context('.', true, /^\.\/.*\.scss$/);
// console.log(context.keys())
requireAll(context)
