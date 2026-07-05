/**
 * Convert a product display name into the slug SauceDemo uses in its
 * data-test attributes, e.g. "Sauce Labs Bike Light" -> "sauce-labs-bike-light".
 */
export const productSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

/**
 * Parse a money label like "Total: $43.18" into the number 43.18.
 */
export const parseAmount = (text) => parseFloat(text.replace(/[^\d.]/g, ''));
