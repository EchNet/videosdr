# Customizing Opt-In

## What you need to get started:

* Access to the AWS console.

* A text editor, or better, a JSON editor. [https://jsoneditoronline.org/](https://jsoneditoronline.org/) is one.

## To customize opt-in for a new customer:

1. Sign in to AWS console. 

2. Go to S3 (under services) and list the contents of the _OptIn_ folder of the _code.convo360.com_ bucket.

3. Select a new name for the customer (so that NEWNAME.json does not already exist)

4. Download an existing .json file.

5. Paste the contents of the .json file into a JSON or text editor.

6. Edit the contents (see below for Tips)

7. Upload the edited file to NEWNAME.json 

8. Present the customer with the code snippet:

```
<script async defer src="https://s3.amazonaws.com/code.convo360.com/OptIn/optin-min.js?NEWNAME"></script>
```

(Substituting NEWNAME with the selected name.)

The code snippet may be inserted anywhere within the host page.

## Tips for editing opt-in configurations

The configuration must be valid JSON format, otherwise opt-in will not function at all on the customer's site.  For this reason it's best to use a JSON editor, which will preserve the format.

[Introduction to JSON](https://blog.scottlowe.org/2013/11/08/a-non-programmers-introduction-to-json/)

The configuration is a list of key-value dictionaries, each of which has a "code" key.

Valid codes include:
* loadModule
* addStylesheet
* createModal
* showModal
* createHover
* handleEvent

These are the building blocks that you use to describe your opt-in content and user interaction.

Guides to customizing each of these appear below.

### createModal

Define a popup.  You must give your popup a unique name, which you'll use to refer to it in a
showModal block, and some HTML.  The value of the html element can be a single string, as in:

```
  {
    "code": "createModal",
    "name": "modal1",
    "html": "<p>This is a paragraph.</p>"
  }
```

... or a list of strings, as in:

```
  {
    "code": "createModal",
    "name": "modal2",
    "html": [
      "<p>This is a paragraph.</p>",
      "<p>This is another paragraph</p>"
    ]
  }
```

Either way, it must be valid HTML.

### createHover

Like createModal, but creates and names a hover button, which slides into view when the
page is loaded.

### showModal

Modal popups are initially invisible.  Use a showModal to make one visible.  The model is
identified by its name.  This will usually happen within a handleEvent block.

### handleEvent

A handleEvent block defines an interactive trigger in the page.  Usually, this defines 
a click region for launching a modal pop-up. The important elements of a handleEvent are
its selector and its action.  The selector selects the element in the HTML page that 
responds to being clicked.  It is a CSS selector.

[Introduction to CSS selectors](https://levelup.gitconnected.com/introduction-to-css-selectors-3993ff9b5f92)

A commonly used selector pattern is the following, which selects a link to an anchor point in the page:

```
  a[href='#anchor']
```

The action is another block, usually a showModal.

### addStylesheet

An addStylesheet blocks lets you insert styles that apply to the HTML elements that you
introduced through createModal and createHover.  This is the best way to insert
device-responsive styling into the code. 

An addStylesheet has either a text element
or a url element.  If text, the text must be valid CSS, which is inserted into the host
page.  It may appear either as a single
string or a list of strings (as the html element of createModal).  If url, a link to the
stylesheet is inserted.

### loadModule

These are only placeholders for future extensions.  Leave them be for now.

