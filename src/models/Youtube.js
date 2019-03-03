const req = require('req-fast')

class Youtube {
  constructor (apiKey) {
    this.apiKey = apiKey
    this.options = {
      base: 'https://www.googleapis.com/youtube/v3'
    }
  }

  async search (query, maxRequests) {
    return new Promise((resolve, reject) => {
      let options = {
        url: `${this.options.base}/search?q=${encodeURIComponent(query)}&maxResults=${maxRequests}&type=video,playlist&part=snippet&key=${this.apiKey}`,
        method: 'GET',
        dataType: 'json'
      }

      console.log(options)

      req(options, (err, res) => {
        if (!err && res.statusCode === 200) {
          if (res.body.pageInfo.totalResults === 0) reject(new Error('EMPTY_RES'))
          resolve(res.body)
        } else reject(err)
      })
    })
  }

  async getVideo (videoID) {
    return new Promise((resolve, reject) => {
      let options = {
        url: this.options.base + '/videos?part=snippet,contentDetails&id=' + videoID + '&key=' + this.apiKey,
        method: 'GET',
        dataType: 'json'
      }

      req(options, (err, res) => {
        if (!err && res.statusCode === 200) {
          if (res.body.items.length === 0) reject(new Error('EMPTY_VID'))
          resolve(res.body)
        } else reject(err)
      })
    })
  }

  async getPlaylist (playlistID) {
    return new Promise((resolve, reject) => {
      let resultPlaylist = []

      const reqPlaylist = (pageToken) => {
        let reqUrl
        if (!pageToken) reqUrl = this.options.base + `/playlistItems/?part=snippet,contentDetails&maxResults=50&playlistId=${playlistID}&key=${this.apiKey}`
        else reqUrl = this.options.base + `/playlistItems/?part=snippet&maxResults=50&playlistId=${playlistID}&key=${this.apiKey}&pageToken=${pageToken}`

        req({ url: reqUrl, method: 'GET', dataType: 'json' }, async (err, res) => {
          if (!err && res.statusCode === 200) {
            if (res.body.items.length) {
              // Filters out deleted videos by checking if thumbnails exist
              resultPlaylist.push(...res.body.items.map(e => {
                if ('thumbnails' in e.snippet) return e.snippet.resourceId.videoId
              }))
            }

            if (res.body.nextPageToken) pageToken = res.body.nextPageToken
            else pageToken = undefined

            if (pageToken) reqPlaylist(pageToken)
            else {
              if (resultPlaylist.length) resolve(resultPlaylist)
              else reject(new Error('EMPTY_PLAYLIST'))
            }
          } else reject(err)
        })
      }

      reqPlaylist()
    })
  }
}

module.exports = Youtube

