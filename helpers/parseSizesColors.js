export default function parseSizesColors(variants) {
  const sizes = {
    hasStock: false
  }  

  variants.forEach(variant => {
    if (variant.stock > 0) {
      sizes.hasStock = true

      if (!(variant.size in sizes)) {
        sizes[variant.size] = [variant]
      } else if(variant.size in sizes) {
        sizes[variant.size].push(variant)  
      }
    }
  })
  return sizes
}
