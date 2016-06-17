# Important Note

Lesson plan was created for my school. It contains RESTfull admin panel and read-only page for students.
However, version at planlekcji.esy.es has unlocked admin account (no password) for show full functionality, so i don't response for any content which may appear there.

# Page for student

![planforstudents](https://cloud.githubusercontent.com/assets/9084222/16149284/05a10674-3490-11e6-97bc-67db4b394fb1.png)

Students can't edit global plan. But if you want, you can locally hide uninteresting lessons. How?
It's simple - just double-click on one of them. 
After click, all usages of this lesson will be hidden.
Your preferences will be automatically save in cookie.
You can easily restore invisible lesson too (of course without clear cookies).
Click the settings icon at upper-right corner. Then you will see all hidden lesson. Clicking on any of them will restore it.

![planforstudentshidden](https://cloud.githubusercontent.com/assets/9084222/16149668/b0a0d78c-3492-11e6-8f06-d0b84a3dd9db.png)

# Page for teacher

![planforteacher](https://cloud.githubusercontent.com/assets/9084222/16149752/1f1a9572-3493-11e6-9765-519c50c27709.png)

All lessons are block elements. They are immutable like Strings - if you create one, you can't edit it. Instead, you should delete this and create new one. Why? Becouse you are supported by powerfull, smart tips, typos are alomst impossible. Just like in real world, you rather want to replace one lesson by another one, than editing existing one. 


<b> 1. Adding a lesson </b>

img

Click on suitable row and start writing. When you type 3 letters, you will see a few matching lessons. Then you will have 3 options:

- Ignore tips and continue typing text, then click enter or focus out row (using mouse or tab).

- Use arrow keys to choose right lesson from list, then click enter.

- Use mouse to click right lesson


Note: If you  see "Not found. Add" / "Nie znaleziono. Dodaj" and you are sure you have not made typo, you should add lesson to database.
To do this, you need:

1. Write whole lesson name.
- Click "add" using your mouse or
- Use your arrow keys to select "add" and click enter or
 
Otherwise, the "unknown" lesson will be added to database while you click "save" (look section 4: save, restore and wipe).

<b> 2. Deleting a lesson </b>

text

<b> 3. Adding more than one lesson in one row </b>

text

<b> 4. Save, restore ale wipe options </b>

text
