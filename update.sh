#!/bin/zsh

# List all folders and subfolders in order, ignore "src" folders
TARGET_DIR="../auto-clicker-auto-fill/libs"

for parent in "$TARGET_DIR"/*/; do
    parent_name=$(basename "${parent%/}")
    
    for child in "$parent"*/; do
        [[ -d "$child" ]] || continue
        child_name=$(basename "${child%/}")

        # Skip 'src' folders
        if [[ "$parent_name" == "ui" ]]; then
            npx nx generate @nx/js:library \
                --directory=packages/$parent_name/components \
                --bundler=swc \
                --importPath=@dhruv-techapps/$parent_name-components \
                --linter=eslint \
                --name=$parent_name-components \
                --publishable=true \
                --unitTestRunner=vitest \
                --includeBabelRc=true \
                --minimal=true \
                --setParserOptionsProject=true \
                --tags=scope:$parent_name \
                --testEnvironment=jsdom \
                --useProjectJson=true \
                --no-interactive \
            
            #remove two files from folder $parent-name.ts and $parent-name.spec.ts

            rm -rf "packages/$parent_name/components/src/lib/$parent_name.ts"
            rm -rf "packages/$parent_name/components/src/lib/$parent_name.spec.ts"

            npx cpy-cli "../auto-clicker-auto-fill/libs/$parent_name/src/**/*" "packages/$parent_name/components/src/" --overwrite
            continue
        fi

        if [[ "$parent_name" == "context" ]]; then
            npx nx generate @nx/js:library \
                --directory=packages/ui/context \
                --bundler=swc \
                --importPath=@dhruv-techapps/ui-context \
                --linter=eslint \
                --name=ui-context \
                --publishable=true \
                --unitTestRunner=vitest \
                --includeBabelRc=true \
                --minimal=true \
                --setParserOptionsProject=true \
                --tags=scope:ui \
                --testEnvironment=jsdom \
                --useProjectJson=true \
                --no-interactive \

            
            #remove two files from folder $parent-name.ts and $parent-name.spec.ts
            rm -rf "packages/ui/context/src/lib/ui-context.ts"
            rm -rf "packages/ui/context/src/lib/ui-context.spec.ts"
                

            npx cpy-cli "../auto-clicker-auto-fill/libs/ui/src/**/*" "packages/ui/context/src/" --overwrite
            continue
        fi

        echo "$parent_name / $child_name"

        npx nx generate @nx/js:library \
            --directory=packages/$parent_name/$child_name \
            --bundler=swc \
            --importPath=@dhruv-techapps/$parent_name-$child_name \
            --linter=eslint \
            --name=$parent_name-$child_name \
            --publishable=true \
            --unitTestRunner=vitest \
            --includeBabelRc=true \
            --minimal=true \
            --setParserOptionsProject=true \
            --tags=scope:$parent_name \
            --testEnvironment=jsdom \
            --useProjectJson=true \
            --no-interactive \
            
        #remove two files from folder $parent-name.ts and $parent-name.spec.ts
        rm -rf "packages/$parent_name/$child_name/src/lib/$parent_name-$child_name.ts"
        rm -rf "packages/$parent_name/$child_name/src/lib/$parent_name-$child_name.spec.ts"

        npx cpy-cli "../auto-clicker-auto-fill/libs/$parent_name/$child_name/src/**/*" "packages/$parent_name/$child_name/src/" --overwrite
    done
done
