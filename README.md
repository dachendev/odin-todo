#### How to deploy to gh-pages

```
npm run build
git add .
git commit -m "Build for gh-pages"
git push
git subtree push --prefix dist origin gh-pages
```