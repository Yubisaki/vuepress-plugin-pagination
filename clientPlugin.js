import paginationMeta from '@dynamic/pagination'

class Pagination {
  constructor (pagination, { pages, route }) {
    let { postsFilter, postsSorter } = pagination

    /* eslint-disable no-eval */
    postsFilter = eval(postsFilter)
    postsSorter = eval(postsSorter)

    const { path } = route
    const { paginationPages } = pagination

    paginationPages.forEach((page, index) => {
      if (page.path === path) {
        this.paginationIndex = index
      }
    })

    if (!this.paginationIndex) {
      this.paginationIndex = 0
    }

    this._paginationPages = paginationPages
    this._currentPage = paginationPages[this.paginationIndex]
    this._posts = pages.filter(postsFilter).sort(postsSorter)
  }

  get currentIndex () {
    return this.paginationIndex;
  }

  get pages () {
    return this._paginationPages;
  }

  get length () {
    return this._paginationPages.length
  }

  get all () {
    return this._posts;
  }

  get posts () {
    if (!this._currentPage) {
      return [];
    }
    const [start, end] = this._currentPage.interval
    return this._posts.slice(start, end + 1)
  }

  get hasPrev () {
    return this.paginationIndex !== 0
  }

  get prevLink () {
    if (this.hasPrev) {
      return this._paginationPages[this.paginationIndex - 1].path
    }
  }

  get hasNext () {
    if (this.length === 0) {
      return false;
    }
    return this.paginationIndex !== this.length - 1
  }

  get nextLink () {
    if (this.hasNext) {
      return this._paginationPages[this.paginationIndex + 1].path
    }
  }
}

export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      $pagination () {
        const { pages } = this.$site
        const pagination = new Pagination(paginationMeta, {
          pages, route: this.$route
        })
        return pagination
      }
    }
  })
}