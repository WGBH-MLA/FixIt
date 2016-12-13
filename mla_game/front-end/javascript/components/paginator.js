/* eslint-disable react/prop-types */
import React from 'react';
import segmentize from 'segmentize';
import Paginator from 'react-pagify';

const Paging = ({
  labels, ellipsis, pagination, pages, onSelect, ...props
}) => (
  <Paginator.Context className="pagination" {...props}
    segments={segmentize({
      page: pagination.page,
      pages: pages,
      beginPages: 3,
      endPages: 3,
      sidePages: 2
    })} onSelect={onSelect}>
    
    <Paginator.Button className={pagination.page > 1 ? 'enabled prev' : 'disabled prev'} page={pagination.page - 1}>
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" strokeWidth="15" fill="none" stroke="black" />
        <polygon points="70,145 145,100 70,55 " transform="matrix(-1,0,0,1,197,0)" />
      </svg>
      <span className="assistive-text">{labels.previous}</span>
    </button>
    </Paginator.Button>    
    
    <Paginator.Button className={pagination.page + 1 < pages ? 'enabled next' : 'disabled next'} page={pagination.page + 1}>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" strokeWidth="15" stroke="black"/>
          <polygon points="70, 55 70, 145 145, 100"/>
        </svg>
         <span className="assistive-text">{labels.next}</span>
      </button>
    </Paginator.Button>

  </Paginator.Context>
);
Paging.defaultProps = {
  labels: {
    previous: 'Previous',
    next: 'Next'
  }
}

export default Paging;