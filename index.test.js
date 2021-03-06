/* eslint-disable no-tabs */
/* eslint-disable no-undef */
let HtmlDiffer = require('html-differ').HtmlDiffer
let pug2svelte = require('.')
let differ = new HtmlDiffer()
let dif = (a, b) => expect(differ.isEqual(pug2svelte(a, { pug: true }), b)).toBeTruthy()

describe('tag', () => {
  test('', () => {
    let str = `
div
  Widget`

    dif(str, `<div><Widget></Widget></div>`)
  })
})

describe('attribute', () => {
  test('contain js expression', () => {
    let str = `a(href='page/{p}') page {p}`
    dif(str, `<a href='page/{p}'>page {p}</a>`)
  })

  test('be js expression', () => {
    let str = `button(disabled={!clickable}) ...`
    dif(str, `<button disabled={!clickable}>...</button>`)
  })

  test('attribute name matches value', () => {
    let str = `button({disabled}) ...`
    dif(str, `<button {disabled}>...</button>`)
  })

  test('spread attributes', () => {
    let str = `Widget({...things})`
    dif(str, `<Widget {...things}></Widget>`)
  })

  test('event with modifier', () => {
    let str = `button(on:click|once={handler})`
    dif(str, `<button on:click|once={handler}></button>`)
  })
})

describe('svelte block', () => {
  test('if', () => {
    let str = `
{#if answer === 42}
  p what was the question?`

    dif(str, `{#if answer === 42}<p>what was the question?</p>{/if}`)
  })

  test('if else', () => {
    let str = `
{#if porridge.temperature > 100}
  p too hot!
{:else if 80 > porridge.temperature}
  p too cold!
{:else}
  p just right!`

    dif(str, `
      {#if porridge.temperature > 100}
        <p>too hot!</p>
      {:else if 80 > porridge.temperature}
        <p>too cold!</p>
      {:else}
        <p>just right!</p>
      {/if}`)
  })

  test('each', () => {
    let str = `
{#each todos as todo}
  p {todo.text}
{:else}
  p No tasks today!`

    dif(str, `
      {#each todos as todo}
        <p>{todo.text}</p>
      {:else}
        <p>No tasks today!</p>
      {/each}`)
  })

  test('await', () => {
    let str = `
{#await promise then value}
  p The value is {value}`

    dif(str, `
      {#await promise then value}
        <p>The value is {value}</p>
      {/await}`)
  })

  test('complicated nested blocks', () => {
    let str = `
div1
  {#if}
    div2
    {#each}
      {#await}
        div3
          div4
    div5
  {:else}
    div6`

    dif(str, `<div1>{#if}<div2></div2>{#each}{#await}<div3><div4></div4></div3>{/await}{/each}<div5></div5>{:else}<div6></div6>{/if}</div1>`)
  })
})

describe('plain text block', () => {
  test('dot', () => {
    let str = `
div
  .
    let a = 1
    a = b + c`

    dif(str, `<div>let a = 1\na = b + c</div>`)
  })

  test('tag', () => {
    let str = `
div.
  let a = 1
  a = b + c`

    dif(str, `<div>let a = 1\na = b + c</div>`)
  })

  test('script', () => {
    let str = `
script.
  func(function(){})`

    dif(str, `<script>func(function(){})</script>`)
  })

  test('block with blank line', () => {
    let str = `
script.
  func(function(){})

  func(function(){})`

    dif(str, `<script>func(function(){})\nfunc(function(){})</script>`)
  })
})

describe('load from html template', () => {
  test('with deprecated html flag', () => {
    let str = `
<template>
p({prop}) a paragraph
</template>

<script>
let prop = 1
</script>`

    let res = `<p {prop}> a paragraph</p>
    <script>let prop = 1</script>`

    expect(differ.isEqual(pug2svelte(str, { html: true }), res)).toBeTruthy()
  })

  test('without deprecated html flag', () => {
    let str = `
<template>
p({prop}) a paragraph
</template>

<script>
let prop = 1
</script>`

    let res = `<p {prop}> a paragraph</p>
    <script>let prop = 1</script>`

    expect(differ.isEqual(pug2svelte(str), res)).toBeTruthy()
  })

  test('empty template', () => {
    let str = `
<script>
let prop = 1
</script>`

    let res = `<script>let prop = 1</script>`

    expect(differ.isEqual(pug2svelte(str), res)).toBeTruthy()
  })
})

describe('tab indent', () => {
  test('complicated nested blocks', () => {
    let str = `
div1
	{#if}
		div2
		{#each}
			{#await}
				div3
					div4
		div5
	{:else}
		div6`

    dif(str, `<div1>{#if}<div2></div2>{#each}{#await}<div3><div4></div4></div3>{/await}{/each}<div5></div5>{:else}<div6></div6>{/if}</div1>`)
  })
})
