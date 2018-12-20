import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import PositionList from './routes/PositionList';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/position" exact component={PositionList} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
