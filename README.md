# Important Note

Lesson plan was created for my school. It contains RESTfull admin panel and read-only page for students and full responsive desing.
However, version at planlekcji.esy.es has disabled admin account (no login and password) for show full functionality, so i don't response for any content which may appear there.

# Page for student

![planforstudents](https://cloud.githubusercontent.com/assets/9084222/16149284/05a10674-3490-11e6-97bc-67db4b394fb1.png)
![planforstudentsresponsive](https://cloud.githubusercontent.com/assets/9084222/16162107/94b69d4c-34d1-11e6-9fb8-9318074a4864.png)

Students can't edit global plan. But if you want, you can locally hide uninteresting lessons. How?
It's simple - just double-click on one of them. 
After click, all usages of this lesson will be hidden.
Your preferences will be automatically save in cookie.
You can easily restore invisible lesson too (of course without clear cookies). To do this:
1. Click the settings icon at upper-right corner. You will see all hidden lesson. 
2. Click on any lessson you want to restore.

![planforstudentshidden](https://cloud.githubusercontent.com/assets/9084222/16149668/b0a0d78c-3492-11e6-8f06-d0b84a3dd9db.png)

# Page for teacher

![planforteacher](https://cloud.githubusercontent.com/assets/9084222/16149752/1f1a9572-3493-11e6-9765-519c50c27709.png)

All lessons are block elements. They are immutable like Strings - if you create one, you can't edit it. Instead, you should delete this and create new one. Why? Becouse you are supported by powerfull, smart tips, typos are alomst impossible. Just like in real world, you rather want to replace one lesson by another one, than editing existing one. 


<b> 1. Adding a lesson </b>

![planforteacheraddlesson](https://cloud.githubusercontent.com/assets/9084222/16162110/97d7486e-34d1-11e6-9ddc-b320194d28cb.png)

Click on suitable row and start writing. When you type 3 letters, you will see a few matching lessons. Then you will have 3 options:

- Ignore tips and continue typing text, then click enter or focus out row (using mouse or tab).

- Use arrow keys to choose right lesson from list, then click enter.

- Use mouse to click right lesson


Note: If you  see "Not found. Add" / "Nie znaleziono. Dodaj" and you are sure you have not made typo, you should add lesson to database.

![planforteachernotfound](https://cloud.githubusercontent.com/assets/9084222/16162115/9e5c3f64-34d1-11e6-8e42-e4a0b2e9a727.png)i

To do this, you need:

1. Write whole lesson name.

- Click "add" using your mouse or

- Use your arrow keys to select "add" and click enter
 
Otherwise, the "unknown" lesson will be added to database while you click "save" (look section 4: save, restore and wipe).

<b> 2. Deleting a lesson </b>

Just move your mouse over block with lesson name which you want delete and double click on them - it is as simple as hidding lessons at student page!

<b> 3. Adding more than one lesson in one row </b>

![planforteachermorethanone](https://cloud.githubusercontent.com/assets/9084222/16162114/9c48e70e-34d1-11e6-8a6c-f10de3c10cb7.png)

To add more than one lesson in one row, you need:

1. Click on row everywhere except already existing lesson-block.

2. Start typing text.

<b> 4. Save, restore ale wipe options </b>

![planforteachermenu](https://cloud.githubusercontent.com/assets/9084222/16162111/9a1e5806-34d1-11e6-82ad-af6cf62beae9.png)

- After create new plan, you should save it. Open the menu by clicking icon on upper-right corner. Then click "save" / "zapisz".

- If you want edit already existing plan, it is possible as well. Click "restore" / "przywróć".

- If you want start with blank template, click "wipe" / "wyczyść".
