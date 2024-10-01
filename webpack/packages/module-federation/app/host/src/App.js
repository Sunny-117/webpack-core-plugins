import React from 'react';
const RemoteNewsList = React.lazy(()=>import('remote/NewsList'));
export default (props)=>{
    return (
        <div>
            <h1>远程的NewsList</h1>
            <React.Suspense fallback="loading RemoteNewsList">
              <RemoteNewsList/>
            </React.Suspense>
        </div>
    )
}