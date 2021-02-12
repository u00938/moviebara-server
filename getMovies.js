const axios = require('axios');
const cheerio = require('cheerio');
const { movie } = require('./models');

function getMovieData (url) {
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data);
      const $movieData = $('div.article');
      movie.create({
        title: $movieData.find('div.mv_info h3 a:eq(0)').text(),
        summary: $movieData.find('div.story_area p.con_tx:eq(0)').text(),
        year: $movieData.find('dl.info_spec dd:eq(0) p span:eq(3) a:eq(0)').text().replace(" ",""),
        genre: $movieData.find('dl.info_spec dd:eq(0) p span:eq(0) a').text(),
        image: $movieData.find('div.poster a img').attr('src')
      })
    })
  }
  
  
  axios.get('https://movie.naver.com/movie/running/current.nhn?view=list&tab=normal&order=likeCount').then(res => {
    const $ = cheerio.load(res.data);
    const $movieList = $('div.lst_wrap').find('ul.lst_detail_t1').children('li');
    console.log($movieList)
    $movieList.each(function (i) {
      getMovieData('https://movie.naver.com' + $(this).find('dl.lst_dsc a').attr('href'))
    })
  }).catch(err => console.error(err));