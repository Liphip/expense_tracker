const view = (posts) => /*html*/ `
    <title>Home</title>
    <section class="section">
        <h1>Home</h1>
        <ul>
            ${posts?.map(post => 
                /*html*/ `<li><a href='#/post/${post.id}'>${post.title}</a></li>`
            ).join('')|| 'Loading...'}
        </ul>
    </section>
`;

export default view;