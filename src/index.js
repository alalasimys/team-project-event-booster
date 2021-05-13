// import './styles.css';
// import './sass/utils/variables.scss'
import './js/scrollUp';
// import preloaderFactory from './js/preloader';

import 'material-design-icons/iconfont/material-icons.css';
import './sass/main.scss';
import './sass/components/_pagination.scss';
// import './js/apiService';
import './js/renderEventCards';
import './js/renderOptionSelect';
// import './js/test';

// import apiService from './js/apiService';
import pagination from 'paginationjs';
import eventsCardTmpl from './templates/eventsCardTmpl.hbs';
import './js/modal';
import chooseLazyLoad from './js/lazy-load';
// import { resultGallery } from './js/test'
// console.log(resultGallery);

// function worldEvents() {
//   fetch(
//     'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&sort=random&apikey=k4ZuaibW7VaW2DqWiJtNRmwq3dAdRpv6',
//   )
//     .then(resp => resp.json())
//     .then(data => {
//       const { events } = data._embedded;
//       const markup = eventsCardTmpl(events);
//       refs.dataContainer.insertAdjacentHTML('beforeend', markup);
//     });
// }

// worldEvents();

const refs = {
  searchForm: document.querySelector('.form-submit'),
  searchInput: document.querySelector('.input'),
  select: document.querySelector('.select'),
  dataContainer: document.querySelector('#dataContainer'),
};

// const preloader = preloaderFactory('#preloader');

let fetchResult = [];
export { fetchResult };

// countryCode = ${refs.select.value}
refs.searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  // preloader.show();
  refs.dataContainer.innerHTML = '';
  const valueInput = e.target.elements[0].value;
  const valueSelect = e.target.nextElementSibling[0].value;
  ApiService.getData(valueSelect, valueInput);
}
class ApiService {
  static getData(valueSelect, valueInput) {
    $('#demo').pagination({
      dataSource: function (done) {
        $.ajax({
          type: 'GET',
          url: `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${valueInput}&sort=random&size=200&countryCode=${valueSelect}&apikey=k4ZuaibW7VaW2DqWiJtNRmwq3dAdRpv6`,
          success: function (data) {
            // console.log(data);
            if ('_embedded' in data) {
              dataForEach(data);
              console.log(data);
              done(data._embedded.events);
              fetchResult = [];
              fetchResult.push(...data._embedded.events);
              // preloader.hide();
            } else {
              alert('sorry bro, no events in this country');
            }
            refs.searchInput.value = '';
          },
        });
      },

      pageSize: 24,
      showPrevious: false,
      showNext: false,
      callback: function (data) {
        // console.log(data);
        $('#dataContainer').html(eventsCardTmpl(data));
        const totalScrollHeight = refs.searchInput.clientHeight;
        window.scrollTo({
          top: totalScrollHeight,
          behavior: 'smooth',
        });
      },
    });
  }
}

/**Sort imgs and add span on data */
function dataForEach(array) {
  array._embedded.events.forEach(i => {
    i.images.sort((a, b) => a.width - b.width);
if (i.info) {
  i.info= [i.info.substr(0, 60), i.info.substr(40)]
}
    // if (i.info) {
    //   i.info =
    //     i.info.substr(0, 40) +
    //     '<span id="dots">...</span><span id="more">' +
    //     i.info.substr(40) +
    //     '</span>';
    // }
    // console.log(i.info);
  });
  
}
/**Rendering first events */
function firstEventRender() {
  ApiService.getData('', '');
}
/** Первый рендеринг и ленивка уйдет в модуль  как только будет фетч*/
firstEventRender();
chooseLazyLoad();


export function onLoadMoreModalBtn () {
  const loadMoreBtn = document.querySelector('.more-info')
  if (document.contains(loadMoreBtn)){
    loadMoreBtn.addEventListener('click', showMore)
  }
}


function showMore (e) {
  e.preventDefault()
  const modal = document.querySelector('.basicLightbox')
  modal.remove()
  document.body.style.overflow = 'auto';
  const id = e.target.parentNode.id
  // const id = document.querySelector('.evt-wrapper').id
  const valueInput = fetchResult.find(e=>e.id===id).name
  ApiService.getData(' ', valueInput);
  console.log(valueInput);
}

