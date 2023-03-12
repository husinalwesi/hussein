import repositories from "@/repositories/index"

export default (ctx, inject) => {
  inject('repositories', repositories(ctx))
}
