const fs = require('fs');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`What's the name of the provider in proper case (Vimeo)? `, (name) => {
  const root = 'src/components/providers';
  const dir = `${root}/${name.toLowerCase()}`;

  if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
    console.warn('⚠️ The provider name must be proper cased: YouTube, Vimeo, Dailymotion.')
    readline.close();
    return;
  }

  if (fs.existsSync(dir)) {
    console.warn('⚠️ You\'re attempting to create a provider that already exists.')
    readline.close();
    return;
  }

  let template = fs.readFileSync(`${root}/templates/_provider.tsx`).toString();
  template = template.replace(/Name/g, name);
  template = template.replace('EventEmitter,', 'EventEmitter, Component,');
  template = template.replace(
    '// @component', 
    `@Component({\n  tag: \'vime-${name.toLowerCase()}\',\n})`
  );

  fs.mkdirSync(dir);
  fs.writeFileSync(`${dir}/${name.toLowerCase()}.tsx`, template);

  readline.close()

  console.log(`🎉 Provider created at \`${dir}\`.`)
})