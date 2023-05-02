const view = (post) => /*html*/ `
    <title>${post.title}</title>
    <section class="section">
        <h1>Post ID : ${post.id}</h1>
        <p>Post Title : ${post.title}</p>
        <p>Post Content : ${post.content}</p>
        <p>Post Author : ${post.name}</p>
    </section>
`;

export default view;