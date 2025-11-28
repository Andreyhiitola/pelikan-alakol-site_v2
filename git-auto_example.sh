#!/bin/bash

# ===============================
# Простой git-помощник
# ===============================

# 1. Проверка, что мы в git-репозитории
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Не в git-репозитории."
  exit 1
fi

# 2. Текущая ветка
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
  echo "Не удалось определить текущую ветку."
  exit 1
fi

echo "Текущая ветка: $CURRENT_BRANCH"
echo

# 3. PULL (по желанию)
read -p "Сделать git pull origin $CURRENT_BRANCH? (y/n): " do_pull
if [[ "$do_pull" =~ ^[Yy]$ ]]; then
  git pull origin "$CURRENT_BRANCH" || { echo "git pull не удался"; exit 1; }
fi

echo
echo "=== git status ==="
git status
echo "=================="
echo

# 4. ВЫБОР ВАРИАНТА git add
echo "Как делать git add?"
echo "1) git add . (добавить всё)"
echo "2) Выбрать файлы по номерам"
echo "3) Пропустить add и выйти"
read -p "Ваш выбор (1/2/3): " add_choice

case "$add_choice" in
  1)
    git add .
    ;;
  2)
    echo
    echo "Список изменённых файлов:"
    # Получаем краткий статус и вытаскиваем имена файлов
    mapfile -t FILES < <(git status --short | awk '{print $2}')

    if [ ${#FILES[@]} -eq 0 ]; then
      echo "Нет файлов для добавления."
      exit 0
    fi

    i=1
    for f in "${FILES[@]}"; do
      echo "$i) $f"
      ((i++))
    done

    echo
    read -p "Введите номера файлов через пробел (например: 1 3 4): " -a SELECTION

    for idx in "${SELECTION[@]}"; do
      file="${FILES[$((idx-1))]}"
      if [ -n "$file" ]; then
        echo "add: $file"
        git add "$file"
      fi
    done
    ;;
  3)
    echo "add пропущен. Выход."
    exit 0
    ;;
  *)
    echo "Неверный выбор. Выход."
    exit 1
    ;;
esac

# 5. COMMIT
echo
read -p "Введите сообщение для коммита: " commit_message
if [ -z "$commit_message" ]; then
  echo "Сообщение коммита не может быть пустым. Отмена."
  exit 1
fi

git commit -m "$commit_message" || { echo "Коммит не удался"; exit 1; }

# 6. ВЫБОР УДАЛЁННОЙ ВЕТКИ ДЛЯ PUSH (по номерам)
echo
echo "Доступные удалённые ветки (origin):"
mapfile -t R_BRANCHES < <(git branch -r | sed 's/^ *//; s|origin/||' | grep -v 'HEAD' | sort -u)

if [ ${#R_BRANCHES[@]} -eq 0 ]; then
  echo "Нет удалённых веток. Push невозможен."
  exit 1
fi

i=1
for b in "${R_BRANCHES[@]}"; do
  echo "$i) $b"
  ((i++))
done

echo
read -p "Выберите номер ветки для push (1..${#R_BRANCHES[@]}): " branch_idx
remote_branch="${R_BRANCHES[$((branch_idx-1))]}"

if [ -z "$remote_branch" ]; then
  echo "Неверный номер. Push отменён."
  exit 1
fi

echo
echo "Будет выполнен:"
echo "git push origin $CURRENT_BRANCH:$remote_branch"
read -p "Подтвердить push? (y/n): " do_push

if [[ "$do_push" =~ ^[Yy]$ ]]; then
  git push origin "$CURRENT_BRANCH:$remote_branch" || { echo "Push не удался"; exit 1; }
  echo "Готово. Запушено в origin $remote_branch."
else
  echo "Push отменён."
fi
