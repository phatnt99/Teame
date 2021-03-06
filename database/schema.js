import Realm from "realm";

export const TODOLIST_SCHEMA = "TodoList";
export const TODO_SCHEMA = "Todo";

export const TodoSchema = {
    name: TODO_SCHEMA,
    primaryKey: "id",
    properties: {
        id: 'int',
        name: { type: 'string', indexed: true },
        done: { type: 'bool', default: false }
    }
};

export const TodoListSchema = {
    name: TODOLIST_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        createDate: 'date',
        todos: { type: 'list', objectType: TODO_SCHEMA }
    }
};

const databaseOptions = {
    path: 'teameTodo.realm',
    schema: [TodoListSchema, TodoSchema],
    schemaVersion: 0,
};

export const insertTodoList = newTodoList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                realm.create(TODOLIST_SCHEMA, newTodoList);
                resolve(newTodoList);
            });
        })
        .catch((error) => reject(error));
});

export const updateTodoList = todoList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                console.log('là id = ', todoList.id);
                let updateData = realm.objectForPrimaryKey(TODO_SCHEMA, todoList.id);
                console.log('có id = ', updateData);
                updateData.done = todoList.done;
                resolve();
            });
        })
        .catch((error) => reject(error));
});

export const deleteTodoList = todoList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let deleteData = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoList.id);
                realm.delete(deleteData);
                resolve();
            });
        })
        .catch((error) => reject(error));
});

export const getNumList = () =>  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let allData = realm.objects(TODOLIST_SCHEMA);
            resolve(allData.length);
        })
        .catch((error) => reject(error));
});

export const getAllTodoList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let allData = realm.objects(TODOLIST_SCHEMA);
            resolve(allData);
        })
        .catch((error) => reject(error));
})

export const getAllTodobyTodoListID = (todoListId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let allData = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoListId);
            resolve(allData.todos);
        })
        .catch((error) => reject(error));
})

export const insertTodo = (newTodo, todoListId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let curTodolist = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoListId);
                curTodolist.todos.push(newTodo);
            });
        })
})

export const updateTodo = todoList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                console.log('là id = ', todoList.id);
                let updateData = realm.objectForPrimaryKey(TODO_SCHEMA, todoList.id);
                console.log('có id = ', updateData);
                updateData.done = todoList.done;
                resolve();
            });
        })
        .catch((error) => reject(error));
});

export const deleteTodo = todoId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let deleteData = realm.objectForPrimaryKey(TODO_SCHEMA, todoId);
                realm.delete(deleteData);
                resolve();
            });
        })
        .catch((error) => reject(error));
});

export default new Realm(databaseOptions);