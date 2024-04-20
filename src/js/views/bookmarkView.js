import icons from 'url:../../img/icons.svg'; // parcel 2
import View from './view';
import previewView from './previewView';

class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
  _message = '';

  addHandlerRender(handler){
    window.addEventListener('load', handler)
  }

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
  }
};

export default new BookmarkView();




