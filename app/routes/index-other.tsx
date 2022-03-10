import Nav from '/@includes/Nav';

export default function Index({ navigation }) {
  return (
    <>
      <header>
        <Nav navigation={navigation} />
      </header>
      <main>
        <section aria-labelledby='main-header'>
          <img src='/@root/public/images/profile_pic.jpg' alt='Me!' />
          <h1 id='main-header'>Ben Smith</h1>
          <h2>
            I'm a developer with a passion for constructing quality user
            experiences for the web!
          </h2>

          <address>
            <ul>
              <li>
                <a href='https://github.com/smithbm2316'>GitHub</a>
              </li>
              <li>
                <a href='https://www.linkedin.com/in/smithbm2316'>LinkedIn</a>
              </li>
              <li>
                <a href='mailto:bsmithdev@mailbox.org'>Email</a>
              </li>
            </ul>
          </address>
        </section>
        <section aria-labelledby='search-header'>
          <form method='get' action='/search/'>
            <h2 id='search-header'>
              <label htmlFor='q'>Search the docs</label>
            </h2>
            <input type='textbox' id='q' name='q' />
            <button type='submit'>Submit to search!</button>
          </form>
        </section>
      </main>
      <footer>
        <address>
          <ul>
            <li>
              <a href='mailto:bsmithdev@mailbox.org'>Email</a>
            </li>
            <li>
              <a href='https://github.com/smithbm2316'>GitHub</a>
            </li>
          </ul>
        </address>
      </footer>
    </>
  );
}
