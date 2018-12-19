'use strict';

/**
 * Episodes.js controller
 *
 * @description: A set of functions called "actions" for managing `Episodes`.
 */

module.exports = {

  /**
   * Retrieve episodes records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.episodes.search(ctx.query);
    } else {
      return strapi.services.episodes.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a episodes record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.episodes.fetch(ctx.params);
  },

  /**
   * Count episodes records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.episodes.count(ctx.query);
  },

  /**
   * Create a/an episodes record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.episodes.add(ctx.request.body);
  },

  /**
   * Update a/an episodes record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.episodes.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an episodes record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.episodes.remove(ctx.params);
  }
};
