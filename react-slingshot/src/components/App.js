import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import { Link, IndexLink } from 'react-router';
import {
  Page,
  List,
  Input,
  ListHeader,
  Tab,
  ListItem,
  BackButton,
  Icon,
  ToolbarButton,
  Tabbar,
  Toolbar,
  Navigator,
  Splitter,
  SplitterContent,
  SplitterSide
} from 'react-onsenui';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderRow = this.renderRow.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
  }

  renderCategories(rowName, idx) {

    return (
        <ListItem
          onClick={() => this.props.onClickMenuItem({mode: 'custom', name: rowName})}
          tappable
          >
          <div class="left">
            <Input type="radio" name="categoryGroup" inputId="r-all"
              checked={ this.props.name === rowName }
            />
          </div>
          <label class="center" for="r-all"> {rowName} </label>
        </ListItem>
      );
  }

  renderRow(row, idx) {
    if (idx == 0) {
      return (
        <ListItem
          onClick={() => this.props.onClickMenuItem({mode: 'default', name: 'All'})}
          tappable
          >
          <div class="left">
            <Input type="radio" name="categoryGroup" inputId="r-all"
              checked={this.props.mode == 'default' &&
                this.props.name === 'All'
              }
            />
          </div>
          <label class="center" for="r-all">All</label>
        </ListItem>
      );
    } else {
      return (
        <ListItem tappable category-id=""
          onClick={() => this.props.onClickMenuItem({mode: 'default', name: 'No category'})}>
          <div class="left">
            <Input type="radio" name="categoryGroup" input-id="r-no"
              checked={this.props.mode == 'default' &&
                this.props.name === 'No category'
              }
            />
          </div>
          <label class="center" for="r-no">No category</label>
        </ListItem>
      );
    }
  }

  render() {
    return (
      <Page id="menuPage">
        <List id="default-category-list"
          dataSource={[0,1]}
          renderHeader={() =>
            <ListHeader>Default</ListHeader>
          }
          renderRow={this.renderRow}
        />
        <List
          dataSource={this.props.categories}
          id="custom-category-list"
          renderHeader={
            () => <ListHeader>Custom categories </ListHeader>
            }
            renderRow={this.renderCategories}
          />
      </Page>
    );
  }
};

class TaskCompleted extends React.Component {
  constructor(props) {
    super(props);
    this.itemRef = {};
    this.renderTask = this.renderTask.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  checkItem(name, row) {
    var node = ReactDOM.findDOMNode(this.itemRef[name]);
    this.props.onUnCompleteItem(node, row);
  }

  deleteItem(name, row) {
    var node = ReactDOM.findDOMNode(this.itemRef[name]);
    this.props.onDeleteItem(node, row);
  }

  renderTask(row, index) {

    const refItem = `item${row.taskKey}`;
    return (
      <ListItem ref={(el) => this.itemRef[refItem] = el} key={refItem} tappable category={row.category} >
          <label className='left'>
            <Input checked onClick={() => this.checkItem(refItem, row)} type='checkbox' />
          </label>
          <div className='center'>
            {row.title}
          </div>
          <div className='right'>
            <Icon onClick={() => this.deleteItem(refItem, row)} style={{color: 'grey', paddingLeft: '4px'}} icon={{default: 'ion-ios-trash-outline', material:'md-delete'}} />
          </div>
        </ListItem>
    );
  }
  render() {
    return (
      <Page>
        <List
          dataSource={this.props.tasks}
          renderRow={this.renderTask} />
      </Page>
    );
  }
};

var Animator = {
  remove: (listItem, callback) => {
    listItem.classList.add('animation-remove');
    listItem.classList.add('hide-children');

    setTimeout(function() {
      listItem.classList.remove('animation-remove');
      listItem.classList.remove('hide-children');
      callback();
    }, 750);
  },

  swipe: (swipeRight, listItem, callback) => {
     var animation = swipeRight  ? 'animation-swipe-right' : 'animation-swipe-left';
     listItem.classList.add('hide-children');
     listItem.classList.add(animation);

     setTimeout(function() {
       listItem.classList.remove(animation);
       listItem.classList.remove('hide-children');
       callback();
     }, 950);
  },

  swipeRight: (listItem, callback) => {
    Animator.swipe(true, listItem, callback);
  },

  swipeLeft: (listItem, callback) => {
    Animator.swipe(false, listItem, callback);
  }

};

class TaskPending extends React.Component {
  constructor(props) {
    super(props);
    this.itemRef = {};
    this.renderTask = this.renderTask.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  checkItem(name, row) {
    var node = ReactDOM.findDOMNode(this.itemRef[name]);
    this.props.onCompleteItem(node, row);
  }

  deleteItem(name, row) {
    var node = ReactDOM.findDOMNode(this.itemRef[name]);
    this.props.onDeleteItem(node, row);

  }

  renderTask(row, index) {

    const refItem = `item${row.taskKey}`;
    return (
      <ListItem ref={(el) => this.itemRef[refItem] = el} key={refItem} tappable category={row.category} >
          <label className='left'>
            <Input onClick={() => this.checkItem(refItem, row)} type='checkbox' />
          </label>
          <div className='center'>
            {row.title}
          </div>
          <div className='right'>
            <Icon onClick={() => this.deleteItem(refItem, row)} style={{color: 'grey', paddingLeft: '4px'}} icon={{default: 'ion-ios-trash-outline', material:'md-delete'}} />
          </div>
        </ListItem>
    );
  }
  render() {
    return (
      <Page>
        <List
          dataSource={this.props.tasks}
          renderRow={this.renderTask} />
      </Page>
    );
  }
};

class PageContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log('uncompleted');
    console.log(this.props.unCompletedTasks);
    console.log(this.props.completedTasks);

    return (
      <Tabbar
        position='bottom'
        renderTabs={(activeIndex, tabbar) => [
          {
            content: <TaskPending {...this.props} tasks={this.props.unCompletedTasks} />,
            tab: <Tab label="Pending" />
            },
            {
              content: <TaskCompleted {...this.props} tasks={this.props.completedTasks} />,
              tab: <Tab label="Completed" />
              }]
        } />
  );
  }
};

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openMenu = this.openMenu.bind(this);
  }

  openMenu() {
    this.props.onMenuClick();
  }

  render() {
    return (
      <Page
        id='tabbarPage'
        renderToolbar={() =>
   <Toolbar>
     <div className='left'>
       <ToolbarButton component="button/menu" onClick={this.openMenu}>
         <Icon icon={{default: 'ion-navicon', material:'md-menu'}} size={{default: 32, material:24}} />
       </ToolbarButton>
     </div>
     <div className="center">To-Do List App 2.0</div>
     <div className="right">
       <ons-if platform="ios other">
         <ToolbarButton component="button/new-task">New</ToolbarButton>
       </ons-if>
     </div>
   </Toolbar> } >
   <PageContent ref='menu' {...this.props} />
  </Page>
   );
  }
};

class FirstPage extends React.Component {
  constructor(props) {
    super(props);
    this.deleteItem = this.deleteItem.bind(this);
    this.completeItem = this.completeItem.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.unCompleteItem = this.unCompleteItem.bind(this);
    this.changeMenuItem = this.changeMenuItem.bind(this);
    this.filter = this.filter.bind(this);
    this.state = {
      filter:
        {
          mode: 'default',
          name: 'All',
          func: () => true
        },
    unCompletedTasks: [
        {
          title: 'Download OnsenUI',
          category: 'Programming',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 0,
        },
        {
          title: 'Install Monaca CLI',
          category: 'Programming',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 1,
        },
        {
          title: 'Star Onsen UI repo on Github',
          category: 'Super important',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 2,
        },
        {
          title: 'Register in the community forum',
          category: 'Super important',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 3,
        },
        {
          title: 'Send donations to Fran and Andreas',
          category: 'Super important',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 4,
        },
        {
          title: 'Profit',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 5,
        },
        {
          title: 'Visit Japan',
          category: 'Travels',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 6,
        },
        {
          title: 'Enjoy an Onsen with Onsen UI team',
          category: 'Personal',
          description: 'Some description.',
          highlight: false,
          urgent: false,
          taskKey: 7,
        }
    ],
    completedTasks: [

    ]
    };
  }

  filter(arr) {
    return arr.filter(this.state.filter.func);
  }

  getCategories() {
    var tasks = this.state.unCompletedTasks.concat(this.state.completedTasks);
    tasks = tasks.map((el) => el.category).filter( (el) => el != null);
    if (this.state.filter.mode == 'custom') {
      tasks.push(this.state.filter.name);
    }
    tasks = _.uniq(tasks);
    console.log(tasks);
    return tasks;
  }

  changeMenuItem(data) {
    let fun;

    if (data.mode == 'default') {
      if (data.name == 'All') {
        fun = () => true;
      } else {
        fun = (el) => (el.category == null);
      }

    } else {
      fun = (el) => (el.category == data.name);
    }

    var filterData = {
      name: data.name,
      mode: data.mode,
      func: fun
    };

    this.setState({
      filter: filterData
    });

  }

  deleteItem(node, rowData) {

    node.classList.add('animation-remove');
    node.classList.add('hide-children');

    setTimeout(() => {
      node.classList.remove('animation-remove');
      node.classList.remove('hide-children');

     var arr1 = this.state.completedTasks
     .filter((el) => el.taskKey !== rowData.taskKey);

     var arr2 = this.state.unCompletedTasks
      .filter((el) => el.taskKey !== rowData.taskKey);

      this.setState({
        completedTasks: arr1,
        unCompletedTasks: arr2
      });

    }, 750);
  }

  completeItem(node, rowData) {
   var animation = 'animation-swipe-right';
   node.classList.add('hide-children');
   node.classList.add(animation);

   setTimeout(() => {
     node.classList.remove(animation);
     node.classList.remove('hide-children');

     var arr1 = this.state.unCompletedTasks
      .filter((el) => el.taskKey !== rowData.taskKey);
     var arr2 = this.state.completedTasks.slice();
     arr2.push(rowData);

     this.setState({
       unCompletedTasks: arr1,
       completedTasks: arr2

     });

   }, 950);
  }

  unCompleteItem(node, rowData) {
   var animation = 'animation-swipe-left';
   node.classList.add('hide-children');
   node.classList.add(animation);

   setTimeout(() => {
     node.classList.remove(animation);
     node.classList.remove('hide-children');

     var arr1 = this.state.completedTasks
      .filter((el) => el.taskKey !== rowData.taskKey);
     var arr2 = this.state.unCompletedTasks.slice();
     arr2.push(rowData);

     this.setState({
       completedTasks: arr1,
       unCompletedTasks: arr2,
     });

   }, 950);
  }

  render() {
    return (
      <Page>
        <Splitter ref='splitter' id="mySplitter">
          <SplitterSide
            onOpen={
              () => this.setState({menuOpen: true})
            }
            onClose={
              () => this.setState({menuOpen: false})
            }
            isOpen={this.state.menuOpen} isSwipeable={true} width="250px" isCollapsed={true} swipeTargetWidth={50}>
            <Menu  categories={this.getCategories()} {...this.state.filter}
              onClickMenuItem={this.changeMenuItem}
            />
          </SplitterSide>
          <SplitterContent>
            <Content
              onMenuClick={() => this.setState({menuOpen: true})}
              unCompletedTasks={this.filter(this.state.unCompletedTasks)}
              completedTasks={this.filter(this.state.completedTasks)}
              onUnCompleteItem={this.unCompleteItem}
              onCompleteItem={this.completeItem}
              onDeleteItem={this.deleteItem} />
          </SplitterContent>
        </Splitter>
      </Page>
    );
  }
};

const App = (props) => {
  return (
    <Navigator
      initialRoute={{
        component: FirstPage
      }}
      renderPage={(route, navigator) => {
        return React.createElement(route.component);
      }} />
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
