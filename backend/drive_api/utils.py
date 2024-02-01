import aiofiles

from fastapi import UploadFile


async def upload_file_to_dir(
    file: UploadFile,
):
    async with aiofiles.open(
        f"./files/{file.filename}",
        "wb",
    ) as new_file:
        await new_file.write(await file.read())



# async def get_file_by_name(
#     file_id: Annotated[str, Path],
#     session: AsyncSession = Depends(db_helper.scoped_session_dependency),
# ) -> FileInDB:

#     file = await session.get(FileInDB, ident=file_id)
#     if file:
#         return file

#     raise HTTPException(
#         status_code=status.HTTP_404_NOT_FOUND,
#         detail=f"file {file_id} not found",
#     )
